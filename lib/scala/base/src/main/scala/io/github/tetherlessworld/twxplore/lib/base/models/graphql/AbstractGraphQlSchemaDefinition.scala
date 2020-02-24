package io.github.tetherlessworld.twxplore.lib.base.models.graphql

import edu.rpi.tw.twks.uri.Uri
import sangria.schema.{Argument, IntType, ScalarAlias, StringType}

abstract class AbstractGraphQlSchemaDefinition {
  // Scalar aliases
  implicit val UriType = ScalarAlias[Uri, String](
    StringType, _.toString, uri => Right(Uri.parse(uri))
  )

  // Scalar argument types
  val LimitArgument = Argument("limit", IntType, description = "Limit")
  val OffsetArgument = Argument("offset", IntType, description = "Offset")
  val TextArgument = Argument("text", StringType, description = "Text")
  val UriArgument = Argument("uri", UriType, description = "URI")
}
