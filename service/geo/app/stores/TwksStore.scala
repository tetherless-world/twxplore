package stores
import edu.rpi.tw.twks.client.{RestTwksClient, RestTwksClientConfiguration, TwksClient}
import edu.rpi.tw.twks.uri.Uri
import edu.rpi.tw.twxplore.lib.utils.rdf.Rdf
import models.domain.Feature
import org.apache.jena.geosparql.implementation.vocabulary.{Geo, GeoSPARQL_URI}
import org.apache.jena.query.{Query, QueryExecution, QueryExecutionFactory, QueryFactory}
import org.apache.jena.vocabulary.RDF

import scala.collection.JavaConverters._

class TwksStore(serverBaseUrl: String) extends Store {
  private val client: TwksClient = new RestTwksClient(RestTwksClientConfiguration.builder().setServerBaseUrl(serverBaseUrl).build())

  override def getFeatures(limit: Int, offset: Int): List[Feature] =
    getFeaturesByUris(getFeatureUris(limit = limit, offset = offset))

  override def getFeaturesCount(): Int = {
      val query = QueryFactory.create(
        s"""
           |PREFIX geo: <${GeoSPARQL_URI.GEO_URI}>
           |PREFIX rdf: <${RDF.getURI}>
           |SELECT (COUNT(DISTINCT ?feature) AS ?count)
           |WHERE {
           |  ?feature rdf:type geo:Feature .
           |}
           |""".stripMargin)
      withQueryExecution(query) {
        queryExecution =>
          queryExecution.execSelect().next().get("count").asLiteral().getInt
    }
  }

  private def getFeaturesByUris(featureUris: List[Uri]): List[Feature] = {
    // Should be safe to inject featureUris since they've already been parsed as URIs
    val query = QueryFactory.create(
      s"""
         |PREFIX geo: <${GeoSPARQL_URI.GEO_URI}>
         |PREFIX rdf: <${RDF.getURI}>
         |PREFIX sf: <${GeoSPARQL_URI.SF_URI}>
         |CONSTRUCT {
         |  ?feature ?featureP ?featureO .
         |  ?geometry ?geometryP ?geometryO .
         |} WHERE {
         |  VALUES ?feature { ${featureUris.map(featureUri => "<" + featureUri.toString() + ">").mkString(" ")} }
         |  ?feature rdf:type geo:Feature .
         |  ?feature geo:hasDefaultGeometry ?geometry .
         |  ?geometry rdf:type sf:Geometry .
         |  ?feature ?featureP ?featureO .
         |  ?geometry ?geometryP ?geometryO .
         |}
         |""".stripMargin)
    withQueryExecution(query) { queryExecution =>
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
    withQueryExecution(query) {
      queryExecution =>
        queryExecution.execSelect().asScala.toList.map(querySolution => Uri.parse(querySolution.get("object").asResource().getURI))
    }
  }

  private def withQueryExecution[T](query: Query)(f: (QueryExecution) => T): T = {
    val queryExecution = client.queryAssertions(query)
    try {
      f(queryExecution)
    } finally {
      queryExecution.close()
    }
  }
}
