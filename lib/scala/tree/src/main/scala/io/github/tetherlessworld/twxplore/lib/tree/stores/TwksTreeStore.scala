package io.github.tetherlessworld.twxplore.lib.tree.stores

import edu.rpi.tw.twks.api.TwksClient
import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{Rdf, RdfReader}
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.Schema
import io.github.tetherlessworld.twxplore.lib.base.stores.BaseTwksStore
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.models.domain.vocabulary.TREE
import io.github.tetherlessworld.twxplore.lib.tree.models.selection.{SelectionInput, SelectionResults}
import javax.inject.Inject
import org.apache.jena.geosparql.implementation.vocabulary.GeoSPARQL_URI
import org.apache.jena.query.QueryFactory
import org.apache.jena.vocabulary.RDF
import play.api.Configuration

import scala.collection.JavaConverters._
import scala.collection.mutable

final class TwksTreeStore(twksClient: TwksClient) extends BaseTwksStore(twksClient) with TreeStore {
  @Inject
  def this(configuration: Configuration) = this(BaseTwksStore.createTwksClient(configuration))

  override final def getTrees(limit: Int, offset: Int): List[Tree] = {
    getTreesByUris(getTreeUris(limit = limit, offset = offset))
  }

  private def getPropertyByUris[P](propertyUris: List[Uri], property: String)(implicit rdfReader: RdfReader[P]): List[P] = {
    if (propertyUris.isEmpty) {
      return List()
    }

    val query = QueryFactory.create(
      s"""
         |PREFIX rdf: <${RDF.getURI}>
         |PREFIX tree: <${TREE.URI + "resource"}>
         |CONSTRUCT {
         |  ?property ?propertyP ?propertyO .
         |  ?property rdf:type tree:$property .
         |} WHERE {
         |  VALUES ?property { ${propertyUris.map(propertyUri => "<" + propertyUri.toString() + ">").mkString(" ")} }
         |  ?property ?propertyP ?propertyO .
         |}
         |""".stripMargin)
    withAssertionsQueryExecution(query) { queryExecution =>
      val model = queryExecution.execConstruct()
      model.listSubjectsWithProperty(RDF.`type`).asScala.toList.map(resource => Rdf.read[P](resource))
    }
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
      val model = queryExecution.execConstruct()
      model.listSubjectsWithProperty(RDF.`type`).asScala.toList.map(resource => {
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
            Uri.parse(querySolution.get("tree").asResource().getURI)
          }
        })
    }
  }

  override final def getTreesBySelection(selection: SelectionInput): SelectionResults = {
    val treeSpeciesMap: mutable.HashMap[String, Uri] = new mutable.HashMap()
    val boroughMap: mutable.HashMap[String, Uri] = new mutable.HashMap()
    val ntaMap: mutable.HashMap[String, Uri] = new mutable.HashMap()
    val blockMap: mutable.HashMap[String, Uri] = new mutable.HashMap()
    val postalCode: mutable.HashMap[String, Uri] = new mutable.HashMap()
    val zipCityMap: mutable.HashMap[String, Uri] = new mutable.HashMap()
    val censusTractMap: mutable.HashMap[String, Uri] = new mutable.HashMap()
    val city: City = City("New York City", List[Uri](), List[Uri](), Uri.parse(TREE.STATE_URI_PREFIX + ":" + "New_York"), Uri.parse(TREE.FEATURE_URI_PREFIX + ":" + "New_York"), Uri.parse(TREE.CITY_URI_PREFIX + ":" + "New York City".replace(" ", "_")))
    val state: State = State("New York", List[Uri](), Uri.parse(TREE.STATE_URI_PREFIX + ":" + "New York".replace(" ", "_")))

    val trees = getTreesByBlockUris(selection.includeBlocks) ++ getTreesByNtaUris(selection.includeNtaList)
    for (tree <- trees) {
      if (tree.species != None) treeSpeciesMap += (tree.species.toString -> tree.species.get)
      zipCityMap += (tree.zipCity.toString -> tree.zipCity)
      postalCode += (tree.postcode.toString -> tree.postcode)
      if (tree.censusTract != None) censusTractMap += (tree.censusTract.toString -> tree.censusTract.get)
      boroughMap += (tree.borough.toString -> tree.borough)
      ntaMap += (tree.NTA.toString -> tree.NTA)
      blockMap += (tree.block.toString -> tree.block)
    }

    SelectionResults(
      blocks = getBlockByUris(blockMap.values.toList),
      boroughs = getBoroughByUris(boroughMap.values.toList),
      censusTracts = getCensusTractByUris(censusTractMap.values.toList),
      city = city,
      ntaList = getNtaByUris(ntaMap.values.toList),
      postcodes = getPostcodeByUris(postalCode.values.toList),
      state = state,
      trees = trees,
      treeSpecies = getSpeciesByUris(treeSpeciesMap.values.toList),
      zipCities = getZipCityByUris(zipCityMap.values.toList)
    )
  }

  private def getBoroughByUris(boroughUris: List[Uri]): List[Borough] = getPropertyByUris[Borough](boroughUris, "borough")

  private def getCensusTractByUris(censusUris: List[Uri]): List[CensusTract] = getPropertyByUris[CensusTract](censusUris, "censusTract")

  private def getPostcodeByUris(postcodeUris: List[Uri]): List[Postcode] = getPropertyByUris[Postcode](postcodeUris, "postcode")

  private def getZipCityByUris(zipCityUris: List[Uri]): List[ZipCity] = getPropertyByUris[ZipCity](zipCityUris, "zipCity")

  private def getSpeciesByUris(speciesUris: List[Uri]): List[TreeSpecies] = getPropertyByUris[TreeSpecies](speciesUris, "species")

  private def getNtaByUris(ntaUris: List[Uri]): List[Nta] = getPropertyByUris[Nta](ntaUris, "NTA")

  private def getBlockByUris(blockUris: List[Uri]): List[Block] = getPropertyByUris[Block](blockUris, "block")

  private def getTreesByNtaUris(ntaUris: List[Uri]): List[Tree] = getTreesBySelections(ntaUris, "nta")

  private def getTreesByBlockUris(blockUris: List[Uri]): List[Tree] = getTreesBySelections(blockUris, "block")

  private def getTreesBySelections(selections: List[Uri], property: String): List[Tree] = {
    val query = QueryFactory.create(
      s"""
         |PREFIX geo: <${GeoSPARQL_URI.GEO_URI}>
         |PREFIX rdf: <${RDF.getURI}>
         |PREFIX sf: <${GeoSPARQL_URI.SF_URI}>
         |PREFIX treeR: <${TREE.resourceURI}>
         |PREFIX treeP: <${TREE.propertyURI}>
         |CONSTRUCT {
         |  ?tree ?treePred ?treeObj .
         |} WHERE {
         |  VALUES ?feature { ${selections.map(selection => "<" + selection.toString() + ">").mkString(" ")} } .
         |  ?tree treeP:$property ?feature .
         |  ?tree rdf:type treeR:tree .
         |  ?tree ?treePred ?treeObj .
         |}
         |""".stripMargin)
    withAssertionsQueryExecution(query) { queryExecution =>
      val model = queryExecution.execConstruct()
      model.listSubjectsWithProperty(RDF.`type`).asScala.toList.map(resource => Rdf.read[Tree](resource))
    }
  }
}
