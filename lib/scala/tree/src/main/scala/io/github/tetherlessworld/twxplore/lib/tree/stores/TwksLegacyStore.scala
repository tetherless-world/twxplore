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

final class TwksLegacyStore(twksClient: TwksClient) extends AbstractTwksStore(twksClient) with LegacyStore {
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

  override final def getBlocksByNta(nta: Nta): List[Block] = getPropertyByProperty[Block](nta.uri, "block")

  override final def getBoroughsByCity(city: City): List[Borough] = getPropertyByProperty[Borough](city.uri, "borough")

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
