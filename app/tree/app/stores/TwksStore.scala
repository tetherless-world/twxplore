package stores
import edu.rpi.tw.twks.client.{RestTwksClient, RestTwksClientConfiguration, TwksClient}
import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.Rdf
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary._
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import org.apache.jena.geosparql.implementation.vocabulary.{Geo, GeoSPARQL_URI}
import org.apache.jena.query.{Query, QueryExecution, QueryFactory}
import org.apache.jena.vocabulary.RDF

import scala.collection.JavaConverters._

class TwksStore(serverBaseUrl: String) extends Store {
  private val client: TwksClient = new RestTwksClient(RestTwksClientConfiguration.builder().setServerBaseUrl(serverBaseUrl).build())

  override def getTrees(limit: Int, offset: Int): List[Tree] =
    getTreesByUris(getTreeUris(limit = limit, offset = offset))

  private def getTreesByUris(TreeUris: List[Uri]): List[Tree] = {
    // Should be safe to inject featureUris since they've already been parsed as URIs
    val query = QueryFactory.create(
      s"""
         |PREFIX rdf: <${RDF.getURI}>
         |PREFIX treeR: <${TREE.URI + "resource"}>
         |PREFIX treeP: <${TREE.URI + "property"}>
         |PREFIX schema: <${Schema.URI}>
         |CONSTRUCT {
         |  ?tree ?treeP ?treeO .
         |  ?tree rdf:type treeR:Tree .
         |  ?block ?blockP ?blockO .
         |  ?borough ?boroughP ?boroughO .
         |  ?censusTract ?censusTractP ?censusTractO .
         |  ?city ?cityP ?cityO .
         |  ?nta ?ntaP ?ntaO .
         |  ?postcode ?postcodeP ?postcodeO .
         |  ?species ?speciesP ?speciesO .
         |  ?state ?stateP ?stateO .
         |  ?zipCity ?zipCityP ?zipCityO .
         |} WHERE {
         |  VALUES ?tree { ${TreeUris.map(TreeUri => "<" + TreeUri.toString() + ">").mkString(" ")} }
         |  ?tree treeP:block ?block .
         |  ?tree treeP:borough ?borough .
         |  ?tree treeP:censusTract ?block .
         |  ?tree schema:city ?city .
         |  ?tree treeP:NTA ?nta .
         |  ?tree schema:postcode ?postcode .
         |  ?tree treeP:species ?species .
         |  ?tree schema:state ?state .
         |  ?tree treeP:zipCity ?zipCity .
         |  ?block ?blockP ?blockO .
         |  ?borough ?boroughP ?boroughO .
         |  ?censusTract ?censusTractP ?censusTractO .
         |  ?city ?cityP ?cityO .
         |  ?nta ?ntaP ?ntaO .
         |  ?postcode ?postcodeP ?postcodeO .
         |  ?species ?speciesP ?speciesO .
         |  ?state ?stateP ?stateO .
         |  ?tree ?treeP ?treeO .
         |  ?zipCity ?zipCityP ?zipCityO .
         |}
         |""".stripMargin)
    withQueryExecution(query) { queryExecution =>
      val model = queryExecution.execConstruct()
      model.listSubjectsWithProperty(RDF.`type`, TREE.TREE_URI_PREFIX).asScala.toList.map(resource => Rdf.read[Tree](resource))
    }
  }

  private def getTreeUris(limit: Int, offset: Int): List[Uri] = {
    val query = QueryFactory.create(
      s"""
         |PREFIX rdf: <${RDF.getURI}>
         |PREFIX tree: <${TREE.URI + "resource"}>
         |
         |SELECT DISTINCT ?feature WHERE {
         |  ?feature rdf:type tree:tree .
         |} LIMIT $limit OFFSET $offset
         |""".stripMargin)
    withQueryExecution(query) {
      queryExecution =>
        queryExecution.execSelect().asScala.toList.map(querySolution => Uri.parse(querySolution.get("tree").asResource().getURI))
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
        queryExecution.execSelect().asScala.toList.map(querySolution => Uri.parse(querySolution.get("feature").asResource().getURI))
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
