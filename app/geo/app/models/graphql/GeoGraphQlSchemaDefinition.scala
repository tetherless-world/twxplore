package models.graphql

import com.github.raduba.gis.ParsedWkt
import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.base.models.graphql.BaseGraphQlSchemaDefinition
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.ParsedGeometry
import models.domain.{Feature, FeatureType, FrequencyRange, TimestampRange}
import sangria.macros.derive._
import sangria.marshalling.{CoercedScalaResultMarshaller, FromInput}
import sangria.schema.{Argument, Field, IntType, InterfaceType, ListType, OptionInputType, Schema, fields}

object GeoGraphQlSchemaDefinition extends BaseGraphQlSchemaDefinition {
  // Enum types
  implicit val FeatureTypeType = deriveEnumType[FeatureType]()

  // Interface types
  implicit val ParsedWkt: InterfaceType[GeoGraphQlSchemaContext, ParsedWkt] =
    InterfaceType(
      "ParsedWkt",
      fields[GeoGraphQlSchemaContext, ParsedWkt](
      )
    )

  // Object types, in dependence order
  implicit val FrequencyRangeObjectType = deriveObjectType[GeoGraphQlSchemaContext, FrequencyRange]()

  implicit val ParsedGeometryObjectType = deriveObjectType[GeoGraphQlSchemaContext, ParsedGeometry]()

  implicit val TimestampRangeObjectType = deriveObjectType[GeoGraphQlSchemaContext, TimestampRange]()

  implicit val FeatureObjectType = deriveObjectType[GeoGraphQlSchemaContext, Feature](
    //    ReplaceField("uri", Field("uri", UriType, resolve = _.value.uri))
  )

  // Input types
  implicit val FeatureQueryInputObjectType = deriveInputObjectType[FeatureQuery](
  )

  implicit val featureQueryFromInput = new FromInput[FeatureQuery] {
    val marshaller = CoercedScalaResultMarshaller.default

    def fromResult(node: marshaller.Node) = {
      val ad = node.asInstanceOf[Map[String, Any]]
      FeatureQuery(
        containsFeatureUri = ad.get("containsFeatureUri").flatMap(value => value.asInstanceOf[Option[Uri]]),
        types = ad.get("types").flatMap(value => value.asInstanceOf[Option[Vector[FeatureType]]].map(vec => vec.toList)),
        withinFeatureUri = ad.get("withinFeatureUri").flatMap(value => value.asInstanceOf[Option[Uri]])
      )
    }
  }

  // Argument types
  val FeatureQueryArgument = Argument("query", FeatureQueryInputObjectType, description = "feature query")
  val OptionalLimitArgument = Argument("limit", OptionInputType(IntType), description = "limit")
  val OptionalOffsetArgument = Argument("offset", OptionInputType(IntType), description = "offset")

  // Query types
  val RootQueryType = sangria.schema.ObjectType("RootQuery", fields[GeoGraphQlSchemaContext, Unit](
    Field("features", ListType(FeatureObjectType), arguments = FeatureQueryArgument :: OptionalLimitArgument :: OptionalOffsetArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getFeatures(limit = ctx.args.argOpt("limit"), offset = ctx.args.argOpt("offset"), query = ctx.args.arg("query"))),
    Field("feature", FeatureObjectType, arguments = UriArgument :: Nil, resolve = (ctx) => ctx.ctx.store.getFeatureByUri(featureUri = ctx.args.arg("uri")))
  ))

  // Schema
  val schema = Schema(
    RootQueryType
  )
}
