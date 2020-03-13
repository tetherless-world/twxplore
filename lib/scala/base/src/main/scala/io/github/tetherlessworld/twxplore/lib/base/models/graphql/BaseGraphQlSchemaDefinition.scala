package io.github.tetherlessworld.twxplore.lib.base.models.graphql

import java.util.Date

import edu.rpi.tw.twks.uri.Uri
import sangria.schema.{Argument, FloatType, IntType, ScalarAlias, StringType}

abstract class BaseGraphQlSchemaDefinition {
  // Scalar aliases
  implicit val DateType = ScalarAlias[Date, Int](
    IntType, (date: Date) => (date.getTime / 1000l).intValue(), (dateInt: Int) => Right(new Date(dateInt * 1000))
  )

  implicit val FloatScalarAlias = ScalarAlias[Float, Double](
    FloatType, _.toDouble, value => {
      Right(value.toFloat)
    }
  )

  implicit val UriType = ScalarAlias[Uri, String](
    StringType, _.toString, uri => Right(Uri.parse(uri))
  )

  // Scalar argument types
  val LimitArgument = Argument("limit", IntType, description = "Limit")
  val OffsetArgument = Argument("offset", IntType, description = "Offset")
  val TextArgument = Argument("text", StringType, description = "Text")
  val UriArgument = Argument("uri", UriType, description = "URI")
}
