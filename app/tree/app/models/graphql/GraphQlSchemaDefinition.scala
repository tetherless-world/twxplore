package models.graphql

import java.util.Date

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.base.models.graphql.AbstractGraphQlSchemaDefinition
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.models.selection.{SelectionArea, SelectionGeometry, SelectionInput, SelectionResults}
import sangria.macros.derive._
import sangria.marshalling.{CoercedScalaResultMarshaller, FromInput}
import sangria.schema.{Argument, Field, InputField, ListInputType, ListType, Schema, fields}

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
  implicit val CensusTractInputType = deriveInputObjectType[CensusTract](
    InputObjectTypeName("CensusTractFieldsInput"),
    ReplaceInputField("uri", InputField("uri", UriType))
  )

  implicit val PostCodeInputType = deriveInputObjectType[Postcode](
    InputObjectTypeName("PostcodeFieldsInput"),
    ReplaceInputField("uri", InputField("uri", UriType))
  )

  implicit val SpeciesInputType = deriveInputObjectType[TreeSpecies](
    InputObjectTypeName("SpeciesFieldsInput"),
    ReplaceInputField("uri", InputField("uri", UriType))
  )

  implicit val ZipCityInputType = deriveInputObjectType[ZipCity](
    InputObjectTypeName("ZipCityFieldsInput"),
    ReplaceInputField("uri", InputField("uri", UriType))
  )

  implicit val BlockInputType = deriveInputObjectType[Block](
    InputObjectTypeName("BlockFieldsInput"),
    ReplaceInputField("uri", InputField("uri", UriType))
  )

  implicit val NtaInputType = deriveInputObjectType[Nta](
    InputObjectTypeName("NtaFieldsInput"),
    ReplaceInputField("uri", InputField("uri", UriType))
  )

  implicit val BoroughInputType = deriveInputObjectType[Borough](
    InputObjectTypeName("BoroughFieldsInput"),
    ReplaceInputField("uri", InputField("uri", UriType))
  )

  implicit val CityInputType = deriveInputObjectType[City](
    InputObjectTypeName("CityFieldsInput"),
    ReplaceInputField("uri", InputField("uri", UriType))
  )

  implicit val StateInputType = deriveInputObjectType[State](
    InputObjectTypeName("StateFieldsInput"),
    ReplaceInputField("uri", InputField("uri", UriType))
  )

  implicit val GeometryInputType = deriveInputObjectType[Geometry](
    InputObjectTypeName("GeometryFieldsInput"),
    ReplaceInputField("uri", InputField("uri", UriType))
  )

  implicit val SelectionInputType = deriveInputObjectType[SelectionInput](
    InputObjectTypeName("SelectionInputFieldsInput"),
    ReplaceInputField("includeNtaList", InputField("includeNtaList", ListInputType(UriType))),
    ReplaceInputField("includeBlocks", InputField("includeBlocks", ListInputType(UriType))),
    ReplaceInputField("excludeNtaList", InputField("excludeNtaList", ListInputType(UriType))),
    ReplaceInputField("excludeBlocks", InputField("excludeBlocks", ListInputType(UriType))),
  )

  implicit val SelectionAreaInputType = deriveInputObjectType[SelectionArea](
    InputObjectTypeName("SelectionAreaFieldsInput"),
    ReplaceInputField("uri", InputField("uri", UriType)),
    ReplaceInputField("parent", InputField("parent", UriType)),
  )

//  implicit val TreeInputType = deriveInputObjectType[Tree](
//    InputObjectTypeName("TreeFieldsInput"),
//    ReplaceInputField("uri", InputField("uri", UriType)),
//    ReplaceInputField("createdAt", InputField("createdAt", DateType)),
//    ReplaceInputField("curbLoc", InputField("curbLoc", CurbLocType)),
//  )

  implicit val GeometryType = deriveObjectType[GraphQlSchemaContext, Geometry](
    //    ReplaceField("uri", Field("uri", UriType, resolve = _.value.uri)),
    //    ReplaceField("wkt", Field("wkt", StringType, resolve = _.value.wkt))
  )

  implicit val FeatureType = deriveObjectType[GraphQlSchemaContext, Feature](
    ReplaceField("uri", Field("uri", UriType, resolve = _.value.uri))
  )

  implicit val StateType = deriveObjectType[GraphQlSchemaContext, State](
    ReplaceField("uri", Field("uri", UriType, resolve = _.value.uri))
  )

  implicit val CityType = deriveObjectType[GraphQlSchemaContext, City](
    ReplaceField("uri", Field("uri", UriType, resolve = _.value.uri))
  )

  implicit val BoroughType = deriveObjectType[GraphQlSchemaContext, Borough](
    ReplaceField("uri", Field("uri", UriType, resolve = _.value.uri))
  )

  implicit val NtaType = deriveObjectType[GraphQlSchemaContext, Nta](
    ReplaceField("uri", Field("uri", UriType, resolve = _.value.uri))
  )

  implicit val BlockType = deriveObjectType[GraphQlSchemaContext, Block](
    ReplaceField("uri", Field("uri", UriType, resolve = _.value.uri)),
  )

  implicit val CensusTractType = deriveObjectType[GraphQlSchemaContext, CensusTract](
    ReplaceField("uri", Field("uri", UriType, resolve = _.value.uri))
  )

  implicit val PostCodeType = deriveObjectType[GraphQlSchemaContext, Postcode](
    ReplaceField("uri", Field("uri", UriType, resolve = _.value.uri))
  )

  implicit val SelectionAreaType = deriveObjectType[GraphQlSchemaContext, SelectionArea](
    ReplaceField("uri", Field("uri", UriType, resolve = _.value.uri)),
    ReplaceField("parent", Field("parent", UriType, resolve = _.value.parent))
  )

  implicit val SelectionGeometryType = deriveObjectType[GraphQlSchemaContext, SelectionGeometry](
    ReplaceField("uri", Field("uri", UriType, resolve = _.value.uri)),
    ReplaceField("geometry", Field("geometry", GeometryType, resolve = _.value.geometry))
  )

  implicit val TreeType = deriveObjectType[GraphQlSchemaContext, Tree](
    ReplaceField("uri", Field("uri", UriType, resolve = _.value.uri)),
  )

  implicit val SpeciesType = deriveObjectType[GraphQlSchemaContext, TreeSpecies](
    ReplaceField("uri", Field("uri", UriType, resolve = _.value.uri))
  )

  implicit val ZipCityType = deriveObjectType[GraphQlSchemaContext, ZipCity](
    ReplaceField("uri", Field("uri", UriType, resolve = _.value.uri))
  )

  implicit val SelectionResultsType = deriveObjectType[GraphQlSchemaContext, SelectionResults](
    ReplaceField("blocks", Field("blocks", ListType(BlockType), resolve = _.value.blocks)),
    ReplaceField("boroughs", Field("boroughs", ListType(BoroughType), resolve = _.value.boroughs)),
    ReplaceField("censusTracts", Field("censusTracts", ListType(CensusTractType), resolve = _.value.censusTracts)),
    ReplaceField("city", Field("city", CityType, resolve = _.value.city)),
    ReplaceField("ntaList", Field("ntaList", ListType(NtaType), resolve = _.value.ntaList)),
    ReplaceField("postcodes", Field("postcodes", ListType(PostCodeType), resolve = _.value.postcodes)),
    ReplaceField("state", Field("state", StateType, resolve = _.value.state)),
    ReplaceField("trees", Field("trees", ListType(TreeType), resolve = _.value.trees)),
    ReplaceField("treeSpecies", Field("treeSpecies", ListType(SpeciesType), resolve = _.value.treeSpecies)),
    ReplaceField("zipCities", Field("zipCities", ListType(ZipCityType), resolve = _.value.zipCities)),
  )


  implicit val geometryFromInput = new FromInput[Geometry] {
    val marshaller = CoercedScalaResultMarshaller.default

    def fromResult(node: marshaller.Node) = {
      val ad = node.asInstanceOf[Map[String, Any]]

      Geometry(
        label = ad.get("label").flatMap(_.asInstanceOf[Option[String]]),
        uri = ad("uri").asInstanceOf[Uri],
        wkt = ad("wkt").asInstanceOf[String]
      )
    }
  }

  implicit val featureFromInput = new FromInput[Feature] {
    val marshaller = CoercedScalaResultMarshaller.default

    def fromResult(node: marshaller.Node) = {
      val ad = node.asInstanceOf[Map[String, Any]]

      Feature(
        geometry = ad("geometry").asInstanceOf[Geometry],
        label = ad("label").asInstanceOf[Option[String]],
        uri = ad("uri").asInstanceOf[Uri]
      )
    }
  }

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

  implicit val treeFromInput = new FromInput[Tree] {
    val marshaller = CoercedScalaResultMarshaller.default

    def fromResult(node: marshaller.Node) = {
      val ad = node.asInstanceOf[Map[String, Any]]

      Tree(
        id = ad("id").asInstanceOf[Int],
        createdAt = ad("createdAt").asInstanceOf[Date],
        dbh = ad.get("dbh").asInstanceOf[Int],
        stump = ad.get("stump").asInstanceOf[Int],
        block = ad.get("block").asInstanceOf[Uri],
        curbLoc = ad.get("curbLoc").asInstanceOf[CurbLoc],
        status = ad.get("status").asInstanceOf[Status],
        health = ad.get("health").asInstanceOf[Option[Health]],
        species = ad.get("species").asInstanceOf[Option[Uri]],
        steward = ad.get("steward").asInstanceOf[Option[Steward]],
        guards = ad.get("guards").asInstanceOf[Option[Guards]],
        sidewalk = ad.get("sidewalk").asInstanceOf[Option[Sidewalk]],
        userType = ad.get("userType").asInstanceOf[UserType],
        problems = ad.get("problems").toList.map( problem => problem.asInstanceOf[Problems]),
        address = ad.get("address").asInstanceOf[String],
        postcode = ad.get("postcode").asInstanceOf[Uri],
        city = ad.get("city").asInstanceOf[Uri],
        zipCity = ad.get("zipCity").asInstanceOf[Uri],
        community = ad.get("community").asInstanceOf[Int],
        borough = ad.get("borough").asInstanceOf[Uri],
        cncldist = ad.get("cncldist").asInstanceOf[Int],
        stateAssembly = ad.get("stateAssembly").asInstanceOf[Int],
        stateSenate = ad.get("stateSenate").asInstanceOf[Int],
        NTA = ad.get("NTA").asInstanceOf[Uri],
        boroughCount = ad.get("boroughCount").asInstanceOf[Int],
        state = ad.get("state").asInstanceOf[Uri],
        latitude = ad.get("latitude").asInstanceOf[Float],
        longitude = ad.get("longitude").asInstanceOf[Float],
        x_sp = ad.get("x_sp").asInstanceOf[Float],
        y_sp = ad.get("y_sp").asInstanceOf[Float],
        censusTract = ad.get("censusTract").asInstanceOf[Option[Uri]],
        bin = ad.get("bin").asInstanceOf[Option[Int]],
        bbl = ad.get("bbl").asInstanceOf[Option[Long]],
        uri = ad.get("uri").asInstanceOf[Uri]
      )
    }
  }

  //  implicit val selectionGeometry = new FromInput[SelectionGeometry] {
  //    val marshaller = CoercedScalaResultMarshaller.default
  //    def fromResult(node: marshaller.Node) = {
  //      val ad = node.asInstanceOf[Map[String, Any]]
  //      SelectionGeometry(
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
  val GeometryArgument = Argument("geometry", GeometryInputType, description = "Geometry Input")
  val BoroughArgument = Argument("borough", BoroughInputType, description = "Borough Input")
  val BoroughsArgument = Argument("boroughs", ListInputType(BoroughInputType), description = "Boroughs Input")
  val NtaArgument = Argument("nta", NtaInputType, description = "NTA Input")
  val NtasArgument = Argument("ntas", ListInputType(NtaInputType), description = "NTAs Input")
  val BlockArgument = Argument("block", BlockInputType, description = "Block Input")
  val BlocksArgument = Argument("blocks", ListInputType(BlockInputType), description = "Blocks Input")
  val CityArgument = Argument("city", CityInputType, description = "City Input")
  val SelectionInputArgument = Argument("selectionInput", SelectionInputType, description = "Selection Input")


  val CitiesType = sangria.schema.ObjectType("Cities", fields[GraphQlSchemaContext, Int](
    Field("geometryOfCity", GeometryType, arguments = CityArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getGeometryOfCity(city = ctx.args.arg("city"))),
    Field("geometries", SelectionGeometryType, arguments= Nil, resolve = (ctx) => ctx.ctx.store.getCityGeometry()),
    Field("hierarchy", ListType(SelectionAreaType), arguments= UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getCityHierarchy(cityUri = ctx.args.arg("cityUri"))),
  ))

  val BlocksType = sangria.schema.ObjectType("Blocks", fields[GraphQlSchemaContext, Int](
    Field("byNta", ListType(BlockType), arguments= NtaArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getBlocksByNta(nta = ctx.args.arg("nta"))),
    Field("geometries", ListType(SelectionGeometryType), arguments= Nil, resolve = (ctx) => ctx.ctx.store.getBlockGeometries()),
    Field("hierarchy", ListType(SelectionAreaType), arguments= UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getBlockHierarchy(blockUri = ctx.args.arg("uri"))),
    Field("byNtaGeometry", ListType(SelectionGeometryType), arguments= UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getBlocksByNtaGeometry(Nta = ctx.args.arg("uri"))),
    Field("geometryOfBlocks", ListType(GeometryType), arguments= BlocksArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getGeometryOfBlocks(blocks = ctx.args.arg("blocks"))),
    Field("geometryOfBlock", GeometryType, arguments= BlockArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getGeometryOfBlock(block = ctx.args.arg("block"))),
  ))

  val BoroughsType = sangria.schema.ObjectType("Boroughs", fields[GraphQlSchemaContext, Int](
    Field("byCity", ListType(BoroughType), arguments= CityArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getBoroughsByCity(city = ctx.args.arg("city"))),
    Field("geometries", ListType(SelectionGeometryType), arguments= Nil, resolve = (ctx) => ctx.ctx.store.getBoroughGeometries()),
    Field("hierarchy", ListType(SelectionAreaType), arguments= UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getBoroughHierarchy(boroughUri = ctx.args.arg("boroughUri"))),
    Field("geometryOfBoroughs", ListType(GeometryType), arguments= BoroughsArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getGeometryOfBoroughs(boroughs = ctx.args.arg("boroughs"))),
    Field("geometryOfBorough", GeometryType, arguments= BoroughArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getGeometryOfBorough(borough = ctx.args.arg("borough"))),
  ))

  val NtasType = sangria.schema.ObjectType("Ntas", fields[GraphQlSchemaContext, Int](
    Field("byBorough", ListType(NtaType), arguments = BoroughArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getNtasByBorough(borough = ctx.args.arg("borough"))),
    Field("geometries", ListType(SelectionGeometryType), arguments= Nil, resolve = (ctx) => ctx.ctx.store.getNtaGeometries()),
    Field("hierarchy", ListType(SelectionAreaType), arguments= UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getNtaHierarchy(ntaUri = ctx.args.arg("ntaUri"))),
    Field("byBoroughGeometry", ListType(SelectionGeometryType), arguments= UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getNtasByBoroughGeometry(borough = ctx.args.arg("uri"))),
    Field("geometryOfNtas", ListType(GeometryType), arguments= NtasArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getGeometryOfNtas(ntas = ctx.args.arg("ntas"))),
    Field("geometryOfNta", GeometryType, arguments= NtaArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getGeometryOfNta(nta = ctx.args.arg("nta"))),
  ))



  // Query types
  val RootQueryType = sangria.schema.ObjectType("RootQuery", fields[GraphQlSchemaContext, Unit](
    Field("trees", ListType(TreeType), arguments = LimitArgument :: OffsetArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getTrees(limit = ctx.args.arg("limit"), offset = ctx.args.arg("offset"))),
    Field("TreesBySelection", SelectionResultsType, arguments= SelectionInputArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getTreesBySelection(selection = ctx.args.arg("selectionInput"))),

    Field("blocks", BlocksType, resolve = ctx => 1),
    Field("ntas", NtasType, resolve = ctx => 1),
    Field("boroughs", BoroughsType, resolve = ctx => 1),
    Field("cities", CitiesType, resolve = ctx => 1),

    Field("block", SelectionGeometryType, arguments= UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getBlockGeometry(blockUri = ctx.args.arg("uri"))),
    Field("nta", SelectionGeometryType, arguments= UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getNtaGeometry(ntaUri = ctx.args.arg("uri"))),
    Field("borough", SelectionGeometryType, arguments= UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getBoroughGeometry(boroughUri = ctx.args.arg("uri"))),
    Field("city", SelectionGeometryType, arguments= UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getCityGeometry(cityUri = ctx.args.arg("uri"))),

    Field("StateHierarchy", ListType(SelectionAreaType), arguments= UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getStateHierarchy(stateUri = ctx.args.arg("stateUri"))),

  ))

  // Schema
  val schema = Schema(
    RootQueryType
  )
}
