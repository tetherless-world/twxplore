package io.github.tetherlessworld.twxplore.lib.base.models.graphql

import java.text.{ParseException, SimpleDateFormat}
import java.util.{Date, TimeZone}

import edu.rpi.tw.twks.uri.Uri
import sangria.schema.{Argument, FloatType, IntType, ScalarAlias, StringType}
import sangria.validation.ValueCoercionViolation

abstract class BaseGraphQlSchemaDefinition {
  private def newIso8601DateFormat() = {
    val tz = TimeZone.getTimeZone("UTC")
    val dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'") // Quoted "Z" to indicate UTC, no timezone offset
    dateFormat.setTimeZone(tz)
    dateFormat
  }

  // Scalar aliases
  implicit val DateType = ScalarAlias[Date, String](
    StringType, (date: Date) => {
      newIso8601DateFormat().format(date)
    }, (dateString: String) => {
      try {
        Right(newIso8601DateFormat().parse(dateString))
      } catch {
        case e: ParseException => Left(new ValueCoercionViolation(e.getMessage) {})
      }
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
