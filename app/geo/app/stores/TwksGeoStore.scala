package stores

import edu.rpi.tw.twks.api.TwksClient
import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.Rdf
import io.github.tetherlessworld.twxplore.lib.base.stores.BaseTwksStore
import javax.inject.Inject
import models.domain.vocabulary.LOCAL
import models.domain.{Feature, FeatureType}
import models.graphql.FeatureQuery
import org.apache.jena.geosparql.implementation.vocabulary.{Geo, GeoSPARQL_URI}
import org.apache.jena.query.QueryFactory
import org.apache.jena.vocabulary.RDF
import play.api.Configuration

import scala.collection.JavaConverters._

final class TwksGeoStore(twksClient: TwksClient) extends BaseTwksStore(twksClient) with GeoStore {
  private val PREFIXES =
    s"""
       |PREFIX geo: <${GeoSPARQL_URI.GEO_URI}>
       |PREFIX geof: <${GeoSPARQL_URI.GEOF_URI}>
       |PREFIX local-ontology: <${LOCAL.ONTOLOGY_URI}>
       |PREFIX rdf: <${RDF.getURI}>
       |PREFIX sf: <${GeoSPARQL_URI.SF_URI}>
       |""".stripMargin

  @Inject
  def this(configuration: Configuration) = this(BaseTwksStore.createTwksClient(configuration))

  override def getFeatures(limit: Option[Int], offset: Option[Int], query: FeatureQuery): List[Feature] =
    if (query.onlyFeatureUri.isDefined) {
      getFeaturesByUris(List(query.onlyFeatureUri.get))
    } else if (limit.isDefined && offset.isDefined) {
      getFeaturesByUris(getFeatureUris(limit = limit.get, offset = offset.get, query = query))
    } else if (!limit.isDefined && !offset.isDefined) {
      getFeatures(query)
    } else {
      throw new IllegalArgumentException("must specify both limit and offset, or neither")
    }

  private def getFeatures(query: FeatureQuery): List[Feature] =
    withAssertionsQueryExecution(QueryFactory.create(
      s"""
         |${PREFIXES}
         |CONSTRUCT {
         |  ?feature ?featureP ?featureO .
         |  ?featureGeometry ?featureGeometryP ?featureGeometryO .
         |} WHERE {
         |${toWherePatterns(query).mkString("\n")}
         |  ?feature ?featureP ?featureO .
         |  ?featureGeometry ?featureGeometryP ?featureGeometryO .
         |}
         |""".stripMargin)) {
      queryExecution =>
        val model = queryExecution.execConstruct()
        model.listSubjectsWithProperty(RDF.`type`, Geo.FEATURE_RES).asScala.toList.map(resource => Rdf.read[Feature](resource))
    }

  override def getFeaturesCount(query: FeatureQuery): Int = {
    withAssertionsQueryExecution(QueryFactory.create(
      s"""
         |${PREFIXES}
         |SELECT (COUNT(DISTINCT ?feature) AS ?count)
         |WHERE {
         |${toWherePatterns(query).mkString("\n")}
         |}
         |""".stripMargin)) {
      queryExecution =>
        queryExecution.execSelect().next().get("count").asLiteral().getInt
    }
  }

  def getFeatureByUri(featureUri: Uri): Feature =
    getFeaturesByUris(List(featureUri)).head

  private def getFeaturesByUris(featureUris: List[Uri]): List[Feature] = {
    if (!featureUris.isEmpty) {
      // Should be safe to inject featureUris since they've already been parsed as URIs
      withAssertionsQueryExecution(QueryFactory.create(
        s"""
           |${PREFIXES}
           |CONSTRUCT {
           |  ?feature ?featureP ?featureO .
           |  ?geometry ?geometryP ?geometryO .
           |} WHERE {
           |  VALUES ?feature { ${featureUris.map(featureUri => "<" + featureUri.toString() + ">").mkString(" ")} }
           |  ?feature geo:hasDefaultGeometry ?geometry .
           |  ?feature ?featureP ?featureO .
           |  ?geometry ?geometryP ?geometryO .
           |}
           |""".stripMargin)) { queryExecution =>
        val model = queryExecution.execConstruct()
        model.listSubjectsWithProperty(RDF.`type`, Geo.FEATURE_RES).asScala.toList.map(resource => Rdf.read[Feature](resource))
      }
    } else {
      List()
    }
  }

  private def getFeatureUris(limit: Int, offset: Int, query: FeatureQuery): List[Uri] = {
    withAssertionsQueryExecution(QueryFactory.create(
      s"""
         |${PREFIXES}
         |SELECT DISTINCT ?feature WHERE {
         |  ${toWherePatterns(query).mkString("\n")}
         |} LIMIT $limit OFFSET $offset
         |""".stripMargin)) {
      queryExecution =>
        queryExecution.execSelect().asScala.toList.map(querySolution => Uri.parse(querySolution.get("feature").asResource().getURI))
    }
  }

  private def toWherePatterns(query: FeatureQuery): List[String] =
    List(
      "?feature rdf:type geo:Feature .",
      "?feature geo:hasDefaultGeometry ?featureGeometry .",
      "?featureGeometry rdf:type sf:Geometry .",
      "?featureGeometry geo:asWKT ?featureGeometryWkt ."
    ) ++
      toContainsFeatureUriWherePatterns(query.containsFeatureUri) ++
      toTypeWherePatterns(query.types) ++
      toWithinFeatureUriWherePatterns(query.withinFeatureUri)

  private def toContainsFeatureUriWherePatterns(containsFeatureUri: Option[Uri]): List[String] =
    // Features that contain the given feature
    // sfContains: Exists if the subject SpatialObject spatially contains the object SpatialObject. DE-9IM: T*****FF*
    if (containsFeatureUri.isDefined) {
      List(
        s"FILTER(?feature != <${containsFeatureUri.get.toString}>) .",
        s"<${containsFeatureUri.get.toString}> geo:hasDefaultGeometry ?containsFeatureGeometry .",
        "?containsFeatureGeometry rdf:type sf:Geometry .",
        "?containsFeatureGeometry geo:asWKT ?containsFeatureGeometryWkt .",
        "FILTER(geof:sfContains(?featureGeometryWkt, ?containsFeatureGeometryWkt))"
      )
    } else {
      List()
    }

  private def toTypeWherePatterns(types: Option[List[FeatureType]]): List[String] =
    if (types.isDefined) {
      List(types.get.map(`type` => s"{ ?feature rdf:type <${`type`.uri.toString}> . }").mkString(" UNION "))
    } else {
      List()
    }

  private def toWithinFeatureUriWherePatterns(withinFeatureUri: Option[Uri]): List[String] =
    // Features within the given feature
    // sfWithin: Exists if the subject SpatialObject is spatially within the object SpatialObject. DE-9IM: T*F**F***
    if (withinFeatureUri.isDefined) {
      List(
        s"FILTER(?feature != <${withinFeatureUri.get.toString}>) .",
        s"<${withinFeatureUri.get.toString}> geo:hasDefaultGeometry ?withinFeatureGeometry .",
        "?withinFeatureGeometry rdf:type sf:Geometry .",
        "?withinFeatureGeometry geo:asWKT ?withinFeatureGeometryWkt .",
        "FILTER(geof:sfWithin(?featureGeometryWkt, ?withinFeatureGeometryWkt))"
      )
    } else {
      List()
    }
}
