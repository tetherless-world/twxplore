package models.graphql

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.base.models.graphql.BaseGraphQlSchemaDefinition
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.{Feature, Geometry}
import sangria.macros.derive._
import sangria.marshalling.{CoercedScalaResultMarshaller, FromInput}
import sangria.schema.{Argument, Field, InputField, ListType, OptionInputType, Schema, fields}

object GeoGraphQlSchemaDefinition extends BaseGraphQlSchemaDefinition {
  // Enum types
  implicit val FeatureTypeType = deriveEnumType[FeatureType]()

  // Object types, in dependence order
  implicit val GeometryObjectType = deriveObjectType[GeoGraphQlSchemaContext, Geometry](
    ReplaceField("uri", Field("uri", UriType, resolve = _.value.uri))
  )

  implicit val FeatureObjectType = deriveObjectType[GeoGraphQlSchemaContext, Feature](
    ReplaceField("uri", Field("uri", UriType, resolve = _.value.uri))
  )

  // Input types
  implicit val GeometryInputObjectType = deriveInputObjectType[Geometry](
    InputObjectTypeName("GeometryInput"),
    ReplaceInputField("uri", InputField("uri", UriType))
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

  // Argument types
  val GeometryArgument = Argument("geometry", GeometryInputObjectType, description="Geometry Input")
  val OptionalFeatureTypeArgument = Argument("featureType", OptionInputType(FeatureTypeType), description="optional feature type")

  // Query types
  val RootQueryType = sangria.schema.ObjectType("RootQuery", fields[GeoGraphQlSchemaContext, Unit](
    Field("features", ListType(FeatureObjectType), arguments = LimitArgument :: OffsetArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getFeatures(limit = ctx.args.arg("limit"), offset = ctx.args.arg("offset"))),
    Field("featureByUri", FeatureObjectType, arguments = UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getFeatureByUri(featureUri = ctx.args.arg("uri"))),
    Field("featuresContaining", ListType(FeatureObjectType), arguments = GeometryArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getFeaturesContaining(ctx.args.arg("geometry"))),
    Field("featuresWithin", ListType(FeatureObjectType), arguments = GeometryArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getFeaturesWithin(ctx.args.arg("geometry")))
  ))

  // Schema
  val schema = Schema(
    RootQueryType
  )
}
