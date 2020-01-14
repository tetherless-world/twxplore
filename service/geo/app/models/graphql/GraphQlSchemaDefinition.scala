package models.graphql

import edu.rpi.tw.twks.uri.Uri
import models.domain.{Feature, Geometry}
import play.api.libs.json
import play.api.libs.json.{JsResult, JsString, JsSuccess, JsValue, Json}
import sangria.macros.derive._
import sangria.marshalling.{CoercedScalaResultMarshaller, FromInput}
import sangria.schema.{Argument, Field, InputField, IntType, ListType, OptionType, ScalarAlias, Schema, StringType, fields}

object GraphQlSchemaDefinition {
  // Scalar Formats
  implicit val uriFormat = new json.Format[Uri] {
    override def reads(json: JsValue): JsResult[Uri] = JsSuccess(Uri.parse(json.asInstanceOf[JsString].value))
    override def writes(o: Uri): JsValue = JsString(o.toString)
  }

  // Scalar aliases
  implicit val UriType = ScalarAlias[Uri, String](
    StringType, _.toString, uri => Right(Uri.parse(uri))
  )

  // Scalar argument types
  val LimitArgument = Argument("limit", IntType, description = "Limit")
  val OffsetArgument = Argument("offset", IntType, description = "Offset")

  // Domain model types, in dependence order
  implicit val GeometryInputType = deriveInputObjectType[Geometry](
//    ReplaceInputField("uri", InputField("uri", UriType))
  )

  implicit val GeometryType = deriveObjectType[GraphQlSchemaContext, Geometry](
      ReplaceField("uri", Field("uri", UriType, resolve = _.value.uri))
  )

  implicit val FeatureType = deriveObjectType[GraphQlSchemaContext, Feature](
    ReplaceField("uri", Field("uri", UriType, resolve = _.value.uri))
  )

  // Argument types
//  implicit val geometryFormat = Json.format[Geometry]
//  val GeometryArgument = Argument("geometry", GeometryInputType)

  // Query types
  val RootQueryType = sangria.schema.ObjectType("RootQuery", fields[GraphQlSchemaContext, Unit](
    Field("features", ListType(FeatureType), arguments = LimitArgument :: OffsetArgument ::  Nil, resolve = (ctx) => ctx.ctx.store.getFeatures(limit = ctx.args.arg("limit"), offset = ctx.args.arg("offset"))),
//    Field("featuresContaining", ListType(FeatureType), arguments = GeometryArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getFeaturesContaining(ctx.args.arg("geometry")) )
  ))

  // Schema
  val schema = Schema(
    RootQueryType
  )
}
