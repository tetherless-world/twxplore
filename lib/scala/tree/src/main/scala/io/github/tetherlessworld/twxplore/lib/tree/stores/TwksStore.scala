package io.github.tetherlessworld.twxplore.lib.tree.stores

import edu.rpi.tw.twks.api.TwksClient
import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{Rdf, RdfReader}
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.{Schema, TREE}
import io.github.tetherlessworld.twxplore.lib.base.stores.AbstractTwksStore
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.models.domain.{SelectionArea, SelectionGeometry, SelectionInput, SelectionResults}
import javax.inject.Inject
import org.apache.jena.geosparql.implementation.vocabulary.GeoSPARQL_URI
import org.apache.jena.query.QueryFactory
import org.apache.jena.vocabulary.{DCTerms, RDF}
import play.api.Configuration

import scala.collection.JavaConverters._
import scala.collection.mutable
import scala.collection.mutable.ListBuffer

class TwksStore(twksClient: TwksClient) extends AbstractTwksStore(twksClient) with Store {
  @Inject
  def this(configuration: Configuration) = this(AbstractTwksStore.createTwksClient(configuration))

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
      val model = queryExecution.execConstruct()
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
            Uri.parse(querySolution.get("tree").asResource().getURI)
          }
        })
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



  def getTreesBySelections(selections: List[Uri], property: String): List[Tree] = {
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

  override def getTreesBySelection(selection: SelectionInput): SelectionResults = {
    val treeSpeciesMap: mutable.HashMap[String, Uri] = new mutable.HashMap()
    val boroughMap: mutable.HashMap[String, Uri] = new mutable.HashMap()
    val ntaMap: mutable.HashMap[String, Uri] = new mutable.HashMap()
    val blockMap: mutable.HashMap[String, Uri] = new mutable.HashMap()
    val postalCode: mutable.HashMap[String, Uri] = new mutable.HashMap()
    val zipCityMap: mutable.HashMap[String, Uri] = new mutable.HashMap()
    val censusTractMap: mutable.HashMap[String, Uri] = new mutable.HashMap()
    val city: City = City("New York City", List[Uri](), List[Uri](), Uri.parse(TREE.STATE_URI_PREFIX + ":" + "New_York"), Uri.parse(TREE.FEATURE_URI_PREFIX + ":" + "New_York"), Uri.parse(TREE.CITY_URI_PREFIX + ":" +"New York City".replace(" ", "_")))
    val state: State = State("New York", List[Uri](), Uri.parse(TREE.STATE_URI_PREFIX + ":" + "New York".replace(" ", "_")))

    def processTree(tree: Tree) = {
      if(tree.species != None) treeSpeciesMap += (tree.species.toString -> tree.species.get)
      zipCityMap += (tree.zipCity.toString -> tree.zipCity)
      postalCode += (tree.postcode.toString -> tree.postcode)
      if(tree.censusTract != None) censusTractMap += (tree.censusTract.toString -> tree.censusTract.get)
      boroughMap += (tree.borough.toString -> tree.borough)
      ntaMap += (tree.NTA.toString -> tree.NTA)
      blockMap += (tree.block.toString -> tree.block)
    }

    val trees = getTreesByBlockUris(selection.includeBlocks.toList).map(tree => {
      processTree(tree)
      tree
    }).to[ListBuffer]

    trees ++= getTreesByNtaUris(selection.includeNtaList.toList).map(tree => {
      processTree(tree)
      tree
    }).to[ListBuffer]

    SelectionResults(
      blocks = getBlockByUris(blockMap.values.toList),
      boroughs = getBoroughByUris(boroughMap.values.toList),
      censusTracts = getCensusTractByUris(censusTractMap.values.toList),
      city = city,
      ntaList = getNtaByUris(ntaMap.values.toList),
      postcodes = getPostcodeByUris(postalCode.values.toList),
      state = state,
      trees = trees.toList,
      treeSpecies = getSpeciesByUris(treeSpeciesMap.values.toList),
      zipCities = getZipCityByUris(zipCityMap.values.toList)
    )
  }

  def getTreesByBoroughUris(boroughUris: List[Uri]): List[Tree] = getTreesBySelections(boroughUris, "borough")
  def getTreesByNtaUris(ntaUris: List[Uri]): List[Tree] = getTreesBySelections(ntaUris, "nta")
  def getTreesByBlockUris(blockUris: List[Uri]): List[Tree] = getTreesBySelections(blockUris, "block")

  def getStateByUri(stateUri: Uri)(implicit rdfReader: RdfReader[State]): State = getPropertyByUris(List(stateUri), "state").head
  def getCityByUri(cityUri: Uri)(implicit rdfReader: RdfReader[City]): City = getPropertyByUris(List(cityUri), "city").head

  private def getBoroughByUri(boroughUri: Uri): Borough = getBoroughByUris(List(boroughUri)).head
  private def getBoroughByUris(boroughUris: List[Uri]): List[Borough] = getPropertyByUris[Borough](boroughUris, "borough")
  private def getBoroughUris(limit: Int, offset: Int): List[Uri] = getTreeResourceUris(limit, offset, "borough")

  def getNtaByUris(ntaUris: List[Uri]): List[Nta] = getPropertyByUris[Nta](ntaUris, "NTA")
  def getNtaByUri(ntaUri: Uri): Nta = getNtaByUris(List(ntaUri)).head

  def getBlockByUris(blockUris: List[Uri]): List[Block] = getPropertyByUris[Block](blockUris, "block")
  def getBlockByUri(blockUri: Uri): Block = getBlockByUris(List(blockUri)).head

  def getCensusTractByUris(censusUris: List[Uri]): List[CensusTract] = getPropertyByUris[CensusTract](censusUris, "censusTract")
  def getPostcodeByUris(postcodeUris: List[Uri]): List[Postcode] = getPropertyByUris[Postcode](postcodeUris, "postcode")
  def getZipCityByUris(zipCityUris: List[Uri]): List[ZipCity] = getPropertyByUris[ZipCity](zipCityUris, "zipCity")
  def getSpeciesByUris(speciesUris: List[Uri]): List[TreeSpecies] = getPropertyByUris[TreeSpecies](speciesUris, "species")

  def getPropertyUris(property: String): List[Uri] = {
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

  def getBlockUris(): List[Uri] = getPropertyUris("block")
  def getNtaUris(): List[Uri] = getPropertyUris("NTA")
  def getBoroughUris(): List[Uri] = getPropertyUris("borough")
  def getCityUri(): Uri = getPropertyUris("city").head
  def getStateUri(): Uri = getPropertyUris("state").head

  def getSelectionGeometries(uriList: List[Uri], property: String) = {
    val geometries = getGeometryOfProperties(property, uriList)
    val result = ListBuffer[SelectionGeometry]()
    for((geometry, i) <- geometries.zipWithIndex){
      result += SelectionGeometry(geometry, uriList(i))
    }
    result.toList
  }

  override def getBlockGeometries(): List[SelectionGeometry] = getSelectionGeometries(getBlockUris(), "block")
  override def getNtaGeometries(): List[SelectionGeometry] = getSelectionGeometries(getNtaUris(), "NTA")
  override def getBoroughGeometries(): List[SelectionGeometry] = getSelectionGeometries(getBoroughUris(), "borough")
  override def getCityGeometry(): SelectionGeometry = getSelectionGeometries(List(getCityUri()), "city").head
  def getStateGeometry(): SelectionGeometry = getSelectionGeometries(List(getStateUri()), "state").head


  def getPropertyByUris[P](propertyUris: List[Uri], property: String)(implicit rdfReader: RdfReader[P]):  List[P] = {
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


  private def getNtasByBoroughUri(boroughUri: Uri): List[Nta] = {
    getNtasByBorough(getBoroughByUri(boroughUri))
  }

  def getSelection(uri: Uri, component: String, parent: String): SelectionArea = {
    val query = QueryFactory.create(
      s"""
         |PREFIX rdf: <${RDF.getURI}>
         |PREFIX dc: <${DCTerms.getURI}>
         |PREFIX treeR: <${TREE.resourceURI}>
         |PREFIX treeP: <${TREE.propertyURI}>
         |SELECT DISTINCT ?component ?componentName ?parent WHERE {
         |  VALUES ?component <$uri>
         |  ?component rdf:type treeR:$component .
         |  ?component rdf:label ?componentName .
         |  ?component treeP:$parent ?parent
         |}
         |""".stripMargin)
    withAssertionsQueryExecution(query) { queryExecution => {
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


  override def getStateHierarchy(stateUri: Uri): List[SelectionArea] = List(SelectionArea("New York", stateUri, "state", null))

  override def getCityHierarchy(cityUri: Uri): List[SelectionArea] = {
    val citySelection = getSelection(cityUri, "city", "state")
    getStateHierarchy(citySelection.parent) :+ citySelection
  }

  override def getBoroughHierarchy(boroughUri: Uri): List[SelectionArea] = {
    val boroughSelection = getSelection(boroughUri, "borough", "city")
    getCityHierarchy(boroughSelection.parent) :+ boroughSelection
  }

  override def getNtaHierarchy(ntaUri: Uri): List[SelectionArea] = {
    val ntaSelection = getSelection(ntaUri, "NTA", "borough")
    getBoroughHierarchy(ntaSelection.parent) :+ ntaSelection
  }


  override def getBlockHierarchy(blockUri: Uri): List[SelectionArea] = {
    val blockSelection = getSelection(blockUri, "block", "NTA")
    getNtaHierarchy(blockSelection.parent) :+ blockSelection
  }

  override def getNtasByBorough(borough: Borough): List[Nta] = getPropertyByProperty[Nta](borough.uri, "NTA")

  override def getGeometryOfCity(city: City): Geometry = getGeometryOfProperty("city", city.uri)
  override def getGeometryOfBoroughs(boroughs: Vector[Borough]): List[Geometry] = getGeometryOfProperties("borough", boroughs.map(borough => borough.uri).toList)
  override def getGeometryOfBorough(borough: Borough): Geometry = getGeometryOfBoroughs(Vector(borough)).head
  override def getGeometryOfNtas(ntas: Vector[Nta]): List[Geometry] = getGeometryOfProperties("NTA", ntas.map(nta => nta.uri).toList)
  override def getGeometryOfNta(nta: Nta): Geometry = getGeometryOfNtas(Vector(nta)).head
  override def getGeometryOfBlocks(blocks: Vector[Block]): List[Geometry] = getGeometryOfProperties("block", blocks.map(block => block.uri).toList)
  override def getGeometryOfBlock(block: Block): Geometry = getGeometryOfBlocks(Vector(block)).head
  private def getGeometryOfProperty(componentPropName: String, property: Uri): Geometry = getGeometryOfProperties(componentPropName, List(property)).head

  def getGeometryOfCityUri(cityUri: Uri): Geometry = getGeometryOfProperty("city", cityUri)
  def getGeometryOfBoroughsUri(boroughsUri: List[Uri]): List[Geometry] = getGeometryOfProperties("borough", boroughsUri)
  def getGeometryOfBoroughUri(boroughUri: Uri): Geometry = getGeometryOfBoroughsUri(List(boroughUri)).head
  def getGeometryOfNtasUri(ntasUri: List[Uri]): List[Geometry] = getGeometryOfProperties("NTA", ntasUri)
  def getGeometryOfNtaUri(ntaUri: Uri): Geometry = getGeometryOfNtasUri(List(ntaUri)).head
  def getGeometryOfBlocksUri(blocksUri: List[Uri]): List[Geometry] = getGeometryOfProperties("block", blocksUri)
  def getGeometryOfBlockUri(blockUri: Uri): Geometry = getGeometryOfBlocksUri(List(blockUri)).head

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
         |  VALUES ?componentProp { ${ properties.map(property => "<" + property + ">").mkString(" ")} }
         |  ?componentProp geo:spatialDimension ?feature .
         |  ?feature geo:hasDefaultGeometry ?geometry .
         |  ?geometry ?geometryP ?geometryO .
         |}
         |""".stripMargin)
    withAssertionsQueryExecution(query) { queryExecution =>
      val model = queryExecution.execConstruct()
      model.listSubjectsWithProperty(RDF.`type`).asScala.toList.map(resource => Rdf.read[Geometry](resource))
    }
  }

  private def getPropertyByProperty[P](overlayProp: Uri, componentPropName: String)(implicit rdfReader: RdfReader[P]): List[P] ={
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

  override def getBlocksByNta(nta: Nta): List[Block] = getPropertyByProperty[Block](nta.uri, "block")
  override def getBoroughsByCity(city: City): List[Borough] = getPropertyByProperty[Borough](city.uri, "borough")

  override def getNtasByBoroughGeometry(borough: Uri): List[SelectionGeometry] = getSelectionGeometries(getPropertyUrisByUri(borough, "NTA"), "NTA")
  override def getBlocksByNtaGeometry(Nta: Uri): List[SelectionGeometry] = getSelectionGeometries(getPropertyUrisByUri(Nta, "block"), "block")
}
