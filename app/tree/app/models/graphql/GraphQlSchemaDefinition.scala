package models.graphql

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.base.models.graphql.AbstractGraphQlSchemaDefinition
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.models.selection.{SelectionArea, SelectionInput, SelectionResults}
import sangria.macros.derive._
import sangria.marshalling.{CoercedScalaResultMarshaller, FromInput}
import sangria.schema.{Argument, Field, ListInputType, ListType, Schema, fields}

object GraphQlSchemaDefinition extends AbstractGraphQlSchemaDefinition {
  implicit val CurbLocType = deriveEnumType[CurbLoc]()
  implicit val HealthType = deriveEnumType[Health]()
  implicit val GuardsType = deriveEnumType[Guards]()
  implicit val ProblemType = deriveEnumType[Problems]()
  implicit val SidewalkType = deriveEnumType[Sidewalk]()
  implicit val StatusType = deriveEnumType[Status]()
  implicit val StewardType = deriveEnumType[Steward]()
  implicit val UserTypeType = deriveEnumType[UserType]()

  // Domain model types, in dependence order
  implicit val CensusTractInputType = deriveInputObjectType[CensusTract](InputObjectTypeName("CensusTractInput"))
  implicit val PostCodeInputType = deriveInputObjectType[Postcode](InputObjectTypeName("PostcodeInput"))
  implicit val SpeciesInputType = deriveInputObjectType[TreeSpecies](InputObjectTypeName("SpeciesInput"))
  implicit val ZipCityInputType = deriveInputObjectType[ZipCity](InputObjectTypeName("ZipCityInput"))
  implicit val BlockInputType = deriveInputObjectType[Block](InputObjectTypeName("BlockInput"))
  implicit val NtaInputType = deriveInputObjectType[Nta](InputObjectTypeName("NtaInput"))
  implicit val BoroughInputType = deriveInputObjectType[Borough](InputObjectTypeName("BoroughInput"))
  implicit val CityInputType = deriveInputObjectType[City](InputObjectTypeName("CityInput"))
  implicit val StateInputType = deriveInputObjectType[State](InputObjectTypeName("StateInput"))
  implicit val GeometryInputType = deriveInputObjectType[Geometry](InputObjectTypeName("GeometryInput"))
  implicit val SelectionInputType = deriveInputObjectType[SelectionInput]()
  implicit val SelectionAreaInputType = deriveInputObjectType[SelectionArea](InputObjectTypeName("SelectionAreaInput"))

  //  implicit val TreeInputType = deriveInputObjectType[Tree](
  //    InputObjectTypeName("TreeInput"),
  //    ReplaceInputField("uri", InputField("uri", UriType)),
  //    ReplaceInputField("createdAt", InputField("createdAt", DateType)),
  //    ReplaceInputField("curbLoc", InputField("curbLoc", CurbLocType)),
  //  )

  implicit val GeometryType = deriveObjectType[GraphQlSchemaContext, Geometry]()
  implicit val FeatureType = deriveObjectType[GraphQlSchemaContext, Feature]()
  implicit val StateType = deriveObjectType[GraphQlSchemaContext, State]()
  implicit val CityType = deriveObjectType[GraphQlSchemaContext, City]()
  implicit val BoroughType = deriveObjectType[GraphQlSchemaContext, Borough]()
  implicit val NtaType = deriveObjectType[GraphQlSchemaContext, Nta]()
  implicit val BlockType = deriveObjectType[GraphQlSchemaContext, Block]()
  implicit val CensusTractType = deriveObjectType[GraphQlSchemaContext, CensusTract]()
  implicit val PostcodeType = deriveObjectType[GraphQlSchemaContext, Postcode]()
  implicit val SelectionAreaType = deriveObjectType[GraphQlSchemaContext, SelectionArea]()
  implicit val TreeType = deriveObjectType[GraphQlSchemaContext, Tree]()
  implicit val TreeSpeciesType = deriveObjectType[GraphQlSchemaContext, TreeSpecies]()
  implicit val ZipCityType = deriveObjectType[GraphQlSchemaContext, ZipCity]()
  implicit val SelectionResultsType = deriveObjectType[GraphQlSchemaContext, SelectionResults]()

  implicit val cityFromInput = new FromInput[City] {
    val marshaller = CoercedScalaResultMarshaller.default

    def fromResult(node: marshaller.Node) = {
      val ad = node.asInstanceOf[Map[String, Any]]

      City(
        name = ad("name").asInstanceOf[String],
        boroughs = ad("boroughs").asInstanceOf[Vector[Uri]].toList,
        postcodes = ad("postcodes").asInstanceOf[Vector[Uri]].toList,
        state = ad("state").asInstanceOf[Uri],
        uri = ad("uri").asInstanceOf[Uri],
        feature = ad("feature").asInstanceOf[Uri]
      )
    }
  }

  implicit val blockFromInput = new FromInput[Block] {
    val marshaller = CoercedScalaResultMarshaller.default

    def fromResult(node: marshaller.Node) = {
      val ad = node.asInstanceOf[Map[String, Any]]

      Block(
        id = ad("id").asInstanceOf[Int],
        name = ad("name").asInstanceOf[String],
        nta = ad("nta").asInstanceOf[Uri],
        feature = ad("feature").asInstanceOf[Uri],
        uri = ad("uri").asInstanceOf[Uri]
      )
    }
  }

  implicit val ntaFromInput = new FromInput[Nta] {
    val marshaller = CoercedScalaResultMarshaller.default

    def fromResult(node: marshaller.Node) = {
      val ad = node.asInstanceOf[Map[String, Any]]

      Nta(
        name = ad("name").asInstanceOf[String],
        nta = ad("nta").asInstanceOf[String],
        blocks = ad("blocks").asInstanceOf[Vector[Uri]].toList,
        borough = ad("borough").asInstanceOf[Uri],
        postCode = ad("postCode").asInstanceOf[Uri],
        feature = ad("feature").asInstanceOf[Uri],
        uri = ad("uri").asInstanceOf[Uri]
      )
    }
  }

  implicit val boroughFromInput = new FromInput[Borough] {
    val marshaller = CoercedScalaResultMarshaller.default

    def fromResult(node: marshaller.Node) = {
      val ad = node.asInstanceOf[Map[String, Any]]

      Borough(
        name = ad("name").asInstanceOf[String],
        borocode = ad("borocode").asInstanceOf[Int],
        city = ad("city").asInstanceOf[Uri],
        ntaList = ad("ntaList").asInstanceOf[Vector[Uri]].toList,
        feature = ad("feature").asInstanceOf[Uri],
        uri = ad("uri").asInstanceOf[Uri]
      )
    }
  }

  //  implicit val selectionGeometry = new FromInput[Feature] {
  //    val marshaller = CoercedScalaResultMarshaller.default
  //    def fromResult(node: marshaller.Node) = {
  //      val ad = node.asInstanceOf[Map[String, Any]]
  //      Feature(
  //        geometry = ad.get("geometry").asInstanceOf[Geometry],
  //        uri = ad.get("uri").asInstanceOf[Uri]
  //      )
  //    }
  //  }

  //  implicit val selectionArea = new FromInput[SelectionArea] {
  //    val marshaller = CoercedScalaResultMarshaller.default
  //
  //    def fromResult(node: marshaller.Node) = {
  //      val ad = node.asInstanceOf[Map[String, Any]]
  //      SelectionArea(
  //        name = ad.get("name").toString,
  //        uri = ad.get("uri").asInstanceOf[Uri],
  //        selection = ad.get("selection").toString,
  //        parent = ad.get("parent").asInstanceOf[Uri]
  //      )
  //    }
  //  }

  implicit val selectionFromInput = new FromInput[SelectionInput] {
    val marshaller = CoercedScalaResultMarshaller.default

    def fromResult(node: marshaller.Node) = {
      val ad = node.asInstanceOf[Map[String, Any]]
      SelectionInput(
        includeNtaList = ad("includeNtaList").asInstanceOf[List[Uri]],
        includeBlocks = ad("includeBlocks").asInstanceOf[List[Uri]],
        excludeNtaList = ad("excludeNtaList").asInstanceOf[List[Uri]],
        excludeBlocks = ad("excludeBlocks").asInstanceOf[List[Uri]]
      )
    }
  }


  // Argument types
  val BlockArgument = Argument("block", BlockInputType, description = "Block Input")
  val BlocksArgument = Argument("blocks", ListInputType(BlockInputType), description = "Blocks Input")
  val BoroughArgument = Argument("borough", BoroughInputType, description = "Borough Input")
  val BoroughsArgument = Argument("boroughs", ListInputType(BoroughInputType), description = "Boroughs Input")
  val CityArgument = Argument("city", CityInputType, description = "City Input")
  val NtaArgument = Argument("nta", NtaInputType, description = "NTA Input")
  val NtasArgument = Argument("ntas", ListInputType(NtaInputType), description = "NTAs Input")
  val SelectionInputArgument = Argument("selectionInput", SelectionInputType, description = "Selection Input")


  val CitiesType = sangria.schema.ObjectType("Cities", fields[GraphQlSchemaContext, Int](
    Field("geometryOfCity", GeometryType, arguments = CityArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getGeometryOfCity(city = ctx.args.arg("city"))),
    Field("geometries", FeatureType, arguments = Nil, resolve = (ctx) => ctx.ctx.store.getCityGeometry()),
    Field("hierarchy", ListType(SelectionAreaType), arguments = UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getCityHierarchy(cityUri = ctx.args.arg("cityUri"))),
  ))

  val BlocksType = sangria.schema.ObjectType("Blocks", fields[GraphQlSchemaContext, Int](
    Field("byNta", ListType(BlockType), arguments = NtaArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getBlocksByNta(nta = ctx.args.arg("nta"))),
    Field("geometries", ListType(FeatureType), arguments = Nil, resolve = (ctx) => ctx.ctx.store.getBlockGeometries()),
    Field("hierarchy", ListType(SelectionAreaType), arguments = UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getBlockHierarchy(blockUri = ctx.args.arg("uri"))),
    Field("byNtaGeometry", ListType(FeatureType), arguments = UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getBlocksByNtaGeometry(Nta = ctx.args.arg("uri"))),
    Field("geometryOfBlocks", ListType(GeometryType), arguments = BlocksArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getGeometryOfBlocks(blocks = ctx.args.arg("blocks"))),
    Field("geometryOfBlock", GeometryType, arguments = BlockArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getGeometryOfBlock(block = ctx.args.arg("block"))),
  ))

  val BoroughsType = sangria.schema.ObjectType("Boroughs", fields[GraphQlSchemaContext, Int](
    Field("byCity", ListType(BoroughType), arguments = CityArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getBoroughsByCity(city = ctx.args.arg("city"))),
    Field("geometries", ListType(FeatureType), arguments = Nil, resolve = (ctx) => ctx.ctx.store.getBoroughGeometries()),
    Field("hierarchy", ListType(SelectionAreaType), arguments = UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getBoroughHierarchy(boroughUri = ctx.args.arg("boroughUri"))),
    Field("geometryOfBoroughs", ListType(GeometryType), arguments = BoroughsArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getGeometryOfBoroughs(boroughs = ctx.args.arg("boroughs"))),
    Field("geometryOfBorough", GeometryType, arguments = BoroughArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getGeometryOfBorough(borough = ctx.args.arg("borough"))),
  ))

  val NtasType = sangria.schema.ObjectType("Ntas", fields[GraphQlSchemaContext, Int](
    Field("byBorough", ListType(NtaType), arguments = BoroughArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getNtasByBorough(borough = ctx.args.arg("borough"))),
    Field("geometries", ListType(FeatureType), arguments = Nil, resolve = (ctx) => ctx.ctx.store.getNtaGeometries()),
    Field("hierarchy", ListType(SelectionAreaType), arguments = UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getNtaHierarchy(ntaUri = ctx.args.arg("ntaUri"))),
    Field("byBoroughGeometry", ListType(FeatureType), arguments = UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getNtasByBoroughGeometry(borough = ctx.args.arg("uri"))),
    Field("geometryOfNtas", ListType(GeometryType), arguments = NtasArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getGeometryOfNtas(ntas = ctx.args.arg("ntas"))),
    Field("geometryOfNta", GeometryType, arguments = NtaArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getGeometryOfNta(nta = ctx.args.arg("nta"))),
  ))



  // Query types
  val RootQueryType = sangria.schema.ObjectType("RootQuery", fields[GraphQlSchemaContext, Unit](
    Field("blocks", BlocksType, resolve = ctx => 1),
    Field("ntas", NtasType, resolve = ctx => 1),
    Field("boroughs", BoroughsType, resolve = ctx => 1),
    Field("cities", CitiesType, resolve = ctx => 1),
    Field("treesBySelection", SelectionResultsType, arguments = SelectionInputArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getTreesBySelection(selection = ctx.args.arg("selectionInput"))),

    Field("block", FeatureType, arguments = UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getBlockGeometry(blockUri = ctx.args.arg("uri"))),
    Field("nta", FeatureType, arguments = UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getNtaGeometry(ntaUri = ctx.args.arg("uri"))),
    Field("borough", FeatureType, arguments = UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getBoroughGeometry(boroughUri = ctx.args.arg("uri"))),
    Field("city", FeatureType, arguments = UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getCityGeometry(cityUri = ctx.args.arg("uri"))),

    Field("StateHierarchy", ListType(SelectionAreaType), arguments = UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getStateHierarchy(stateUri = ctx.args.arg("stateUri"))),

  ))

  // Schema
  val schema = Schema(
    RootQueryType
  )
}
