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

final class TwksHierarchyStore(twksClient: TwksClient) extends AbstractTwksStore(twksClient) with HierarchyStore {
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
