package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri

trait Geometry {
  val label: Option[String]
  val uri: Uri
}
