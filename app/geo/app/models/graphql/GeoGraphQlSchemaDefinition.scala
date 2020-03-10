package models.graphql

import io.github.tetherlessworld.twxplore.lib.base.models.graphql.BaseGraphQlSchemaDefinition
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.{Feature, Geometry}
import sangria.macros.derive._
import sangria.marshalling.{CoercedScalaResultMarshaller, FromInput}
import sangria.schema.{Argument, Field, ListType, Schema, fields}

object GeoGraphQlSchemaDefinition extends BaseGraphQlSchemaDefinition {
  // Enum types
  implicit val FeatureTypeType = deriveEnumType[FeatureType]()

  // Object types, in dependence order
  implicit val GeometryObjectType = deriveObjectType[GeoGraphQlSchemaContext, Geometry](
    ReplaceField("uri", Field("uri", UriType, resolve = _.value.uri))
  )

  implicit val FeatureObjectType = deriveObjectType[GeoGraphQlSchemaContext, Feature](
//    ReplaceField("uri", Field("uri", UriType, resolve = _.value.uri))
  )

  // Input types
  implicit val FeatureQueryInputObjectType = deriveInputObjectType[FeatureQuery](
  )

  implicit val featureQueryFromInput = new FromInput[FeatureQuery] {
    val marshaller = CoercedScalaResultMarshaller.default

    def fromResult(node: marshaller.Node) = {
      val ad = node.asInstanceOf[Map[String, String]]
      FeatureQuery(
        `type` = ad.get("type").flatMap(value => FeatureType.values.find(testValue => testValue.toString == value)),
        withinWkt = ad.get("withinWkt")
      )
    }
  }

  // Argument types
  val FeatureQueryArgument = Argument("query", FeatureQueryInputObjectType, description = "feature query")

  // Query types
  val RootQueryType = sangria.schema.ObjectType("RootQuery", fields[GeoGraphQlSchemaContext, Unit](
    Field("features", ListType(FeatureObjectType), arguments = LimitArgument :: OffsetArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getFeatures(limit = ctx.args.arg("limit"), offset = ctx.args.arg("offset"))),
    Field("feature", FeatureObjectType, arguments = UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getFeatureByUri(featureUri = ctx.args.arg("uri")))
  ))

  // Schema
  val schema = Schema(
    RootQueryType
  )
}
