package io.github.tetherlessworld.twxplore.lib.tree.stores

import edu.rpi.tw.twks.api.TwksClient
import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{Rdf, RdfReader}
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.{Schema, TREE}
import io.github.tetherlessworld.twxplore.lib.base.stores.AbstractTwksStore
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.models.selection.SelectionArea
import javax.inject.Inject
import org.apache.jena.geosparql.implementation.vocabulary.GeoSPARQL_URI
import org.apache.jena.query.QueryFactory
import org.apache.jena.vocabulary.{DCTerms, RDF, RDFS}
import play.api.Configuration

import scala.collection.JavaConverters._
import scala.collection.mutable.ListBuffer

final class TwksLegacyStore(twksClient: TwksClient) extends AbstractTwksStore(twksClient) with LegacyStore {
  override final def getBlockFeatures(): List[Feature] = getSelectionGeometries(getBlockUris(), "block")

  private def getBlockUris(): List[Uri] = getPropertyUris("block")

  override final def getNtaFeatures(): List[Feature] = getSelectionGeometries(getNtaUris(), "NTA")

  private def getNtaUris(): List[Uri] = getPropertyUris("NTA")

  override final def getBoroughFeatures(): List[Feature] = getSelectionGeometries(getBoroughUris(), "borough")

  private def getBoroughUris(): List[Uri] = getPropertyUris("borough")

  private def getPropertyUris(property: String): List[Uri] = {
    val query = QueryFactory.create(
      s"""
         |PREFIX rdf: <${RDF.getURI}>
         |PREFIX dc: <${DCTerms.getURI}>
         |PREFIX treeR: <${TREE.resourceURI}>
         |PREFIX treeP: <${TREE.propertyURI}>
         |SELECT DISTINCT ?component WHERE {
         |  ?component rdf:type treeR:$property .
         |}
         |""".stripMargin)
    withAssertionsQueryExecution(query) { queryExecution => {
      queryExecution.execSelect().asScala.map(querySolution => Uri.parse(querySolution.get("component").asResource().getURI)).toList
    }
    }
  }

  private def getSelectionGeometries(uriList: List[Uri], property: String) = {
    val result = ListBuffer[Feature]()
    for (uri <- uriList) {
      val geometry = getGeometryOfProperties(property, List(uri)).head
      result += Feature(geometry = geometry, label = None, uri = uri)
    }
    result.toList
  }

  override final def getCityFeature(): Feature = getSelectionGeometries(List(getCityUri()), "city").head

  private def getCityUri(): Uri = getPropertyUris("city").head

  override final def getBlockHierarchy(blockUri: Uri): List[SelectionArea] = {
    val blockSelection = getSelection(blockUri, "block", TREE.propertyURI.toString + "NTA")
    getNtaHierarchy(blockSelection.parent) :+ blockSelection
  }

  override final def getNtaHierarchy(ntaUri: Uri): List[SelectionArea] = {
    val ntaSelection = getSelection(ntaUri, "NTA", TREE.propertyURI.toString + "borough")
    getBoroughHierarchy(ntaSelection.parent) :+ ntaSelection
  }

  override final def getBoroughHierarchy(boroughUri: Uri): List[SelectionArea] = {
    val boroughSelection = getSelection(boroughUri, "borough", Schema.URI.toString + "city")
    getCityHierarchy(boroughSelection.parent) :+ boroughSelection
  }

  override final def getCityHierarchy(cityUri: Uri): List[SelectionArea] = {
    val citySelection = getSelection(cityUri, "city", Schema.URI.toString + "state")
    getStateHierarchy(citySelection.parent) :+ citySelection
  }

  override final def getStateHierarchy(stateUri: Uri): List[SelectionArea] = List(SelectionArea("New York", stateUri, "state", Uri.parse("")))

  private def getSelection(uri: Uri, component: String, parentUri: String): SelectionArea = {
    val query = QueryFactory.create(
      s"""
         |PREFIX rdf: <${RDF.getURI}>
         |PREFIX rdfs: <${RDFS.getURI}>
         |PREFIX dc: <${DCTerms.getURI}>
         |PREFIX treeR: <${TREE.resourceURI}>
         |PREFIX treeP: <${TREE.propertyURI}>
         |SELECT DISTINCT ?component ?componentName ?parent WHERE {
         |  VALUES ?component {<$uri>}
         |  ?component rdfs:label ?componentName .
         |  ?component <$parentUri> ?parent
         |}
         |""".stripMargin)
    withAssertionsQueryExecution(query) { queryExecution => {
      println(uri.toString, component, parentUri)
      queryExecution.execSelect().asScala.map(querySolution => {
        SelectionArea(querySolution.get("componentName").asLiteral().getString,
          Uri.parse(querySolution.get("component").asResource().getURI),
          component,
          Uri.parse(querySolution.get("parent").asResource().getURI)
        )
      }).toList.head
    }
    }
  }

  override final def getCityGeometry(city: City): Geometry = getGeometryOfProperty("city", city.uri)

  private def getGeometryOfProperty(componentPropName: String, property: Uri): Geometry = getGeometryOfProperties(componentPropName, List(property)).head

  override final def getBoroughGeometry(borough: Borough): Geometry = getBoroughGeometries(List(borough)).head

  override final def getBoroughGeometries(boroughs: List[Borough]): List[Geometry] = getGeometryOfProperties("borough", boroughs.map(borough => borough.uri).toList)

  override final def getNtaGeometry(nta: Nta): Geometry = getNtaGeometries(List(nta)).head

  override final def getNtaGeometries(ntas: List[Nta]): List[Geometry] = getGeometryOfProperties("NTA", ntas.map(nta => nta.uri).toList)

  private def getGeometryOfProperties(componentPropName: String, properties: List[Uri]): List[Geometry] = {
    val query = QueryFactory.create(
      s"""
         |PREFIX rdf: <${RDF.getURI}>
         |PREFIX geo: <${GeoSPARQL_URI.GEO_URI}>
         |PREFIX treeR: <${TREE.resourceURI}>
         |PREFIX treeP: <${TREE.propertyURI}>
         |CONSTRUCT {
         |  ?geometry ?geometryP ?geometryO .
         |}
         |WHERE {
         |  VALUES ?componentProp { ${properties.map(property => "<" + property + ">").mkString(" ")} }
         |  ?componentProp geo:spatialDimension ?feature .
         |  ?feature geo:hasDefaultGeometry ?geometry .
         |  ?geometry ?geometryP ?geometryO .
         |}
         |""".stripMargin)
    withAssertionsQueryExecution(query) { queryExecution =>
      val model = queryExecution.execConstruct()
      model.listSubjectsWithProperty(RDF.`type`).asScala.map(resource => Rdf.read[Geometry](resource)).toList
    }
  }

  override final def getBlockGeometry(block: Block): Geometry = getBlockGeometries(List(block)).head

  override final def getBlockGeometries(blocks: List[Block]): List[Geometry] = getGeometryOfProperties("block", blocks.map(block => block.uri).toList)

  override final def getBlocksByNta(nta: Nta): List[Block] = getPropertyByProperty[Block](nta.uri, "block")

  override final def getBoroughsByCity(city: City): List[Borough] = getPropertyByProperty[Borough](city.uri, "borough")

  override final def getNtaFeaturesByBorough(borough: Uri): List[Feature] = getSelectionGeometries(getPropertyUrisByUri(borough, "NTA"), "NTA")

  override final def getBlockFeaturesByNta(nta: Uri): List[Feature] = getSelectionGeometries(getPropertyUrisByUri(nta, "block"), "block")

  private def getPropertyUrisByUri(overlayProp: Uri, componentPropName: String): List[Uri] = {
    val query = QueryFactory.create(
      s"""
         |PREFIX rdf: <${RDF.getURI}>
         |PREFIX dc: <${DCTerms.getURI}>
         |PREFIX treeR: <${TREE.resourceURI}>
         |PREFIX treeP: <${TREE.propertyURI}>
         |SELECT DISTINCT ?componentProp WHERE {
         |  VALUES ?overlayProp { ${"<" + overlayProp.toString() + ">"} }
         |  ?overlayProp treeP:$componentPropName ?componentProp .
         |  ?componentProp rdf:type treeR:$componentPropName .
         |}
         |""".stripMargin)
    withAssertionsQueryExecution(query) { queryExecution => {
      queryExecution.execSelect().asScala.map(querySolution => Uri.parse(querySolution.get("componentProp").asResource().getURI)).toList
    }
    }
  }

  override final def getBlockFeature(blockUri: Uri): Feature = getFeature(blockUri, "block")

  override final def getNtaFeature(ntaUri: Uri): Feature = getFeature(ntaUri, "NTA")

  private def getFeature(uri: Uri, componentProp: String): Feature = getSelectionGeometries(List(uri), componentProp).head

  override final def getBoroughFeature(boroughUri: Uri): Feature = getFeature(boroughUri, "borough")

  override final def getCityFeature(cityUri: Uri): Feature = getFeature(cityUri, "city")

  @Inject
  def this(configuration: Configuration) = this(AbstractTwksStore.createTwksClient(configuration))

  //  private def getTreesByBoroughUris(boroughUris: List[Uri]): List[Tree] = getTreesBySelections(boroughUris, "borough")
  //
  //  private def getStateByUri(stateUri: Uri)(implicit rdfReader: RdfReader[State]): State = getPropertyByUris(List(stateUri), "state").head
  //
  //  private def getCityByUri(cityUri: Uri)(implicit rdfReader: RdfReader[City]): City = getPropertyByUris(List(cityUri), "city").head
  //
  //  private def getNtaByUri(ntaUri: Uri): Nta = getNtaByUris(List(ntaUri)).head
  //
  //  private def getBlockByUri(blockUri: Uri): Block = getBlockByUris(List(blockUri)).head

  //  private def getStateGeometry(): Feature = getSelectionGeometries(List(getStateUri()), "state").head
  //
  //  private def getStateUri(): Uri = getPropertyUris("state").head
  //
  //  private def getGeometryOfCityUri(cityUri: Uri): Geometry = getGeometryOfProperty("city", cityUri)
  //
  //  private def getGeometryOfBoroughUri(boroughUri: Uri): Geometry = getGeometryOfBoroughsUri(List(boroughUri)).head

  private def getGeometryOfBoroughsUri(boroughsUri: List[Uri]): List[Geometry] = getGeometryOfProperties("borough", boroughsUri)

  //  private def getGeometryOfNtaUri(ntaUri: Uri): Geometry = getGeometryOfNtasUri(List(ntaUri)).head

  //  private def getGeometryOfNtasUri(ntasUri: List[Uri]): List[Geometry] = getGeometryOfProperties("NTA", ntasUri)
  //
  //  private def getGeometryOfBlockUri(blockUri: Uri): Geometry = getGeometryOfBlocksUri(List(blockUri)).head

  //  private def getGeometryOfBlocksUri(blocksUri: List[Uri]): List[Geometry] = getGeometryOfProperties("block", blocksUri)

  //  private def getBoroughUris(limit: Int, offset: Int): List[Uri] = getTreeResourceUris(limit, offset, "borough")

  //  private def getTreeResourceUris(limit: Int, offset: Int, model: String): List[Uri] = {
  //    val query = QueryFactory.create(
  //      s"""
  //         |PREFIX rdf: <${RDF.getURI}>
  //         |PREFIX tree: <${TREE.URI + "resource:"}>
  //         |SELECT DISTINCT ?feature WHERE {
  //         |  ?feature rdf:type tree:$model .
  //         |} LIMIT $limit OFFSET $offset
  //         |""".stripMargin)
  //    withAssertionsQueryExecution(query) {
  //      queryExecution =>
  //        queryExecution.execSelect().asScala.toList.map(querySolution => Uri.parse(querySolution.get("feature").asResource().getURI))
  //    }
  //  }
  //
  //  private def getNtasByBoroughUri(boroughUri: Uri): List[Nta] = {
  //    getNtasByBorough(getBoroughByUri(boroughUri))
  //  }

  private def getBoroughByUri(boroughUri: Uri): Borough = getBoroughByUris(List(boroughUri)).head

  private def getBoroughByUris(boroughUris: List[Uri]): List[Borough] = getPropertyByUris[Borough](boroughUris, "borough")

  override final def getNtasByBorough(borough: Borough): List[Nta] = getPropertyByProperty[Nta](borough.uri, "NTA")

  private def getPropertyByProperty[P](overlayProp: Uri, componentPropName: String)(implicit rdfReader: RdfReader[P]): List[P] = {
    val query = QueryFactory.create(
      s"""
         |PREFIX rdf: <${RDF.getURI}>
         |PREFIX geo: <${GeoSPARQL_URI.GEO_URI}>
         |PREFIX treeR: <${TREE.resourceURI}>
         |PREFIX treeP: <${TREE.propertyURI}>
         |CONSTRUCT {
         |  ?componentProp ?componentPropP ?componentPropO .
         |  ?componentProp rdf:type treeR:$componentPropName .
         |}
         |WHERE {
         |  VALUES ?overlayProp { ${"<" + overlayProp.toString() + ">"} }
         |  ?overlayProp treeP:$componentPropName ?componentProp .
         |  ?componentProp rdf:type treeR:$componentPropName .
         |  ?componentProp ?componentPropP ?componentPropO .
         |}
         |""".stripMargin)
    withAssertionsQueryExecution(query) { queryExecution =>
      val model = queryExecution.execConstruct()
      model.listSubjectsWithProperty(RDF.`type`).asScala.toList.map(resource => Rdf.read[P](resource))
    }
  }
}
