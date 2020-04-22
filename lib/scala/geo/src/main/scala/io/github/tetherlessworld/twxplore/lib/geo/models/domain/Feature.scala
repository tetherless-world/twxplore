package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri

trait Feature {
  val geometry: UnparsedGeometry
  val label: Option[String]
  val uri: Uri
}
