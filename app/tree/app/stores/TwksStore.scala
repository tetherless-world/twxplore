package stores

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{Rdf, RdfReader}
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.{Schema, TREE}
import io.github.tetherlessworld.twxplore.lib.base.stores.{AbstractTwksStore, TwksStoreConfiguration}
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import org.apache.jena.geosparql.implementation.vocabulary.{Geo, GeoSPARQL_URI}
import org.apache.jena.query.QueryFactory
import org.apache.jena.vocabulary.RDF

import scala.collection.JavaConverters._

class TwksStore(configuration: TwksStoreConfiguration) extends AbstractTwksStore(configuration) with Store {
  override def getTrees(limit: Int, offset: Int): List[Tree] = {
    getTreesByUris(getTreeUris(limit = limit, offset = offset))
  }

  private def getTreesByUris(TreeUris: List[Uri]): List[Tree] = {
    // Should be safe to inject featureUris since they've already been parsed as URIs
    val query = QueryFactory.create(
      s"""
         |PREFIX rdf: <${RDF.getURI}>
         |PREFIX treeR: <${TREE.URI + "resource:"}>
         |PREFIX treeP: <${TREE.URI + "property:"}>
         |PREFIX schema: <${Schema.URI}>
         |CONSTRUCT {
         |  ?tree ?treeP ?treeO .
         |} WHERE {
         |  VALUES ?tree { ${TreeUris.map(TreeUri => "<" + TreeUri.toString() + ">").mkString(" ")} }
         |  ?tree ?treeP ?treeO .
         |}
         |""".stripMargin)
    withAssertionsQueryExecution(query) { queryExecution =>
      val before = System.currentTimeMillis()
      val model = queryExecution.execConstruct()
      val after = System.currentTimeMillis()
      println("It took " + (after - before)/1000 + " seconds to execute")
      model.write(System.out)
      model.listSubjectsWithProperty(RDF.`type`).asScala.toList.map(resource =>{
        Rdf.read[Tree](resource)
      })
    }
  }

  private def getTreeUris(limit: Int, offset: Int): List[Uri] = {
    val query = QueryFactory.create(
      s"""
         |PREFIX rdf: <${RDF.getURI}>
         |PREFIX tree: <${TREE.URI + "resource:"}>
         |
         |SELECT DISTINCT ?tree WHERE {
         |  ?tree rdf:type tree:tree .
         |} LIMIT $limit OFFSET $offset
         |""".stripMargin)
    withAssertionsQueryExecution(query) {
      queryExecution =>
        queryExecution.execSelect().asScala.toList.map({

          querySolution => {
            println(querySolution)
            Uri.parse(querySolution.get("tree").asResource().getURI)
          }
        })
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

  private def getTreeResourceUris(limit: Int, offset: Int, model: String): List[Uri] = {
      val query = QueryFactory.create(
        s"""
           |PREFIX rdf: <${RDF.getURI}>
           |PREFIX tree: <${TREE.URI + "resource:"}>
           |SELECT DISTINCT ?feature WHERE {
           |  ?feature rdf:type tree:$model .
           |} LIMIT $limit OFFSET $offset
           |""".stripMargin)
      withAssertionsQueryExecution(query) {
        queryExecution =>
          queryExecution.execSelect().asScala.toList.map(querySolution => Uri.parse(querySolution.get("feature").asResource().getURI))
      }
    }

  private def getBoroughByUri(boroughUri: Uri): Borough = {
    getBoroughsByUris(List(boroughUri)).head
  }

  private def getBoroughsByUris(boroughUris: List[Uri]): List[Borough] = {
    val query = QueryFactory.create(
      s"""
         |PREFIX rdf: <${RDF.getURI}>
         |PREFIX tree: <${TREE.URI + "resource"}>
         |CONSTRUCT {
         |  ?borough ?boroughP ?boroughO .
         |  ?borough rdf:type tree:borough .
         |} WHERE {
         |  VALUES ?borough { ${boroughUris.map(boroughUri => "<" + boroughUri.toString() + ">").mkString(" ")} }
         |  ?borough ?boroughP ?boroughO .
         |}
         |""".stripMargin)
    withAssertionsQueryExecution(query) { queryExecution =>
      val model = queryExecution.execConstruct()
      model.listSubjectsWithProperty(RDF.`type`, TREE.BOROUGH_URI_PREFIX).asScala.toList.map(resource => Rdf.read[Borough](resource))
    }
  }

  private def getBoroughUris(limit: Int, offset: Int): List[Uri] = {
    getTreeResourceUris(limit, offset, "borough")
  }

  private def getNtasByBoroughUri(boroughUri: Uri): List[Nta] = {
    getNtasByBorough(getBoroughByUri(boroughUri))
  }

  override def getNtasByBorough(borough: Borough): List[Nta] = {
    getPropertyByProperty[Nta](borough.uri, "NTA")
  }

  private def getPropertyByProperty[P](overlayProp: Uri, componentPropName: String)(implicit rdfReader: RdfReader[P]): List[P] ={
    val query = QueryFactory.create(
      s"""
         |PREFIX rdf: <${RDF.getURI}>
         |PREFIX treeR: <${TREE.URI + "resource:"}>
         |PREFIX treeP: <${TREE.URI + "property:"}>
         |CONSTRUCT {
         |  ?block ?blockP ?blockO .
         |  ?block rdf:type treeR:$componentPropName
         |}
         |WHERE {
         |  VALUES ?nta { ${"<" + overlayProp.toString() + ">"} }
         |  ?nta treeP:$componentPropName ?block .
         |  ?block rdf:type treeR:$componentPropName .
         |  ?block ?blockP ?blockO .
         |}
         |""".stripMargin)
    withAssertionsQueryExecution(query) { queryExecution =>
      val model = queryExecution.execConstruct()
      model.listSubjectsWithProperty(RDF.`type`).asScala.toList.map(resource => Rdf.read[P](resource))
    }
  }

  override def getBlocksByNta(nta: Nta): List[Block] = {
    getPropertyByProperty[Block](nta.uri, "block")
  }

  override def getBoroughsByCity(city: City): List[Borough] = {
    getPropertyByProperty[Borough](city.uri, "borough")
  }
}
