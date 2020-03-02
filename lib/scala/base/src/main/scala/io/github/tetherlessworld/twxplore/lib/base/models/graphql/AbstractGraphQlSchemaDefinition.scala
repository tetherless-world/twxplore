package io.github.tetherlessworld.twxplore.lib.base.models.graphql

import java.util.Date

import edu.rpi.tw.twks.uri.Uri
import sangria.schema.{Argument, FloatType, IntType, ScalarAlias, StringType}

abstract class AbstractGraphQlSchemaDefinition {
  // Scalar aliases
  implicit val DateType = ScalarAlias[Date, String](
    StringType, _.toString, date => {
      val dateFormatter = new java.text.SimpleDateFormat("EEE MMM dd hh:mm:ss zzz yyyy")
      Right(dateFormatter.parse(date))
    }
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
