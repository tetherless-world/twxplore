package io.github.tetherlessworld.twxplore.lib.tree.stores

import edu.rpi.tw.twks.api.TwksClient
import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.Rdf
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.TREE
import io.github.tetherlessworld.twxplore.lib.base.stores.AbstractTwksStore
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import javax.inject.Inject
import org.apache.jena.geosparql.implementation.vocabulary.GeoSPARQL_URI
import org.apache.jena.query.QueryFactory
import org.apache.jena.vocabulary.{DCTerms, RDF}
import play.api.Configuration

import scala.collection.JavaConverters._
import scala.collection.mutable.ListBuffer

final class TwksFeatureStore(twksClient: TwksClient) extends AbstractTwksStore(twksClient) with FeatureStore {
  @Inject
  def this(configuration: Configuration) = this(AbstractTwksStore.createTwksClient(configuration))

  override final def getBlockFeatures(): List[Feature] = getFeatures(getBlockUris(), "block")

  private def getBlockUris(): List[Uri] = getPropertyUris("block")

  override final def getNtaFeatures(): List[Feature] = getFeatures(getNtaUris(), "NTA")

  private def getNtaUris(): List[Uri] = getPropertyUris("NTA")

  override final def getBoroughFeatures(): List[Feature] = getFeatures(getBoroughUris(), "borough")

  private def getBoroughUris(): List[Uri] = getPropertyUris("borough")

  override final def getCityFeature(): Feature = getFeatures(List(getCityUri()), "city").head

  private def getCityUri(): Uri = getPropertyUris("city").head

  private final def getPropertyUris(property: String): List[Uri] = {
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

  private def getFeatures(uriList: List[Uri], property: String) = {
    val result = ListBuffer[Feature]()
    for (uri <- uriList) {
      val geometry = getGeometryOfProperties(property, List(uri)).head
      result += Feature(geometry = geometry, label = None, uri = uri)
    }
    result.toList
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

  override final def getNtaFeaturesByBorough(borough: Uri): List[Feature] = getFeatures(getPropertyUrisByUri(borough, "NTA"), "NTA")

  override final def getBlockFeaturesByNta(nta: Uri): List[Feature] = getFeatures(getPropertyUrisByUri(nta, "block"), "block")

  override final def getBlockFeature(blockUri: Uri): Feature = getFeature(blockUri, "block")

  override final def getNtaFeature(ntaUri: Uri): Feature = getFeature(ntaUri, "NTA")

  private def getFeature(uri: Uri, componentProp: String): Feature = getFeatures(List(uri), componentProp).head

  override final def getBoroughFeature(boroughUri: Uri): Feature = getFeature(boroughUri, "borough")

  override final def getCityFeature(cityUri: Uri): Feature = getFeature(cityUri, "city")

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
}
