package stores

import edu.rpi.tw.twks.api.TwksClient
import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.Rdf
import io.github.tetherlessworld.twxplore.lib.base.stores.AbstractTwksStore
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.{Feature, Geometry}
import org.apache.jena.geosparql.implementation.vocabulary.{Geo, GeoSPARQL_URI}
import org.apache.jena.query.QueryFactory
import org.apache.jena.vocabulary.{RDF, RDFS}

import scala.collection.JavaConverters._

class TwksGeoStore(twksClient: TwksClient) extends AbstractTwksStore(twksClient) with GeoStore {
  override def getFeatures(limit: Int, offset: Int): List[Feature] =
    getFeaturesByUris(getFeatureUris(limit = limit, offset = offset))

  override def getFeaturesCount(): Int = {
    val query = QueryFactory.create(
      s"""
         |PREFIX geo: <${GeoSPARQL_URI.GEO_URI}>
         |PREFIX rdf: <${RDF.getURI}>
         |PREFIX sf: <${GeoSPARQL_URI.SF_URI}>
         |SELECT (COUNT(DISTINCT ?feature) AS ?count)
         |WHERE {
         |  ?feature rdf:type geo:Feature .
         |  ?feature geo:hasDefaultGeometry ?geometry .
         |  ?geometry rdf:type sf:Geometry .
         |}
         |""".stripMargin)
    withAssertionsQueryExecution(query) {
      queryExecution =>
        queryExecution.execSelect().next().get("count").asLiteral().getInt
    }
  }

  override def getFeaturesContaining(geometry: Geometry): List[Feature] = {
    val query = QueryFactory.create(
      s"""
         |PREFIX geo: <${GeoSPARQL_URI.GEO_URI}>
         |PREFIX geof: <${GeoSPARQL_URI.GEOF_URI}>
         |PREFIX rdf: <${RDF.getURI}>
         |PREFIX rdfs: <${RDFS.getURI}>
         |SELECT ?feature ?featureLabel ?featureGeometry ?featureGeometryLabel ?featureGeometryWkt
         |WHERE {
         |  ?feature geo:hasDefaultGeometry ?featureGeometry .
         |  ?feature rdfs:label ?featureLabel .
         |  ?featureGeometry geo:asWKT ?featureGeometryWkt .
         |  ?featureGeometry rdfs:label ?featureGeometryLabel .
         |  FILTER(geof:sfContains(?featureGeometryWkt, <${geometry.uri}>)) .
         |}
         |""".stripMargin)
    withAssertionsQueryExecution(query) {
      queryExecution =>
        val model = queryExecution.execConstruct()
        model.listSubjectsWithProperty(RDF.`type`, Geo.FEATURE_RES).asScala.toList.map(resource => Rdf.read[Feature](resource))
    }
  }


  def getFeatureByUri(featureUri: Uri): Feature =
    getFeaturesByUris(List(featureUri)).head

  private def getFeaturesByUris(featureUris: List[Uri]): List[Feature] = {
    // Should be safe to inject featureUris since they've already been parsed as URIs
    val query = QueryFactory.create(
      s"""
         |PREFIX geo: <${GeoSPARQL_URI.GEO_URI}>
         |PREFIX rdf: <${RDF.getURI}>
         |PREFIX sf: <${GeoSPARQL_URI.SF_URI}>
         |CONSTRUCT {
         |  ?feature ?featureP ?featureO .
         |  ?feature rdf:type geo:Feature .
         |  ?geometry ?geometryP ?geometryO .
         |} WHERE {
         |  VALUES ?feature { ${featureUris.map(featureUri => "<" + featureUri.toString() + ">").mkString(" ")} }
         |  ?feature geo:hasDefaultGeometry ?geometry .
         |  ?feature ?featureP ?featureO .
         |  ?geometry ?geometryP ?geometryO .
         |}
         |""".stripMargin)
    withAssertionsQueryExecution(query) { queryExecution =>
      val model = queryExecution.execConstruct()
      model.listSubjectsWithProperty(RDF.`type`, Geo.FEATURE_RES).asScala.toList.map(resource => Rdf.read[Feature](resource))
    }
  }

  private def getFeatureUris(limit: Int, offset: Int): List[Uri] = {
    val query = QueryFactory.create(
      s"""
         |PREFIX geo: <${GeoSPARQL_URI.GEO_URI}>
         |PREFIX rdf: <${RDF.getURI}>
         |SELECT DISTINCT ?feature WHERE {
         |  ?feature rdf:type geo:Feature .
         |} LIMIT $limit OFFSET $offset
         |""".stripMargin)
    withAssertionsQueryExecution(query) {
      queryExecution =>
        queryExecution.execSelect().asScala.toList.map(querySolution => Uri.parse(querySolution.get("feature").asResource().getURI))
    }
  }
}
