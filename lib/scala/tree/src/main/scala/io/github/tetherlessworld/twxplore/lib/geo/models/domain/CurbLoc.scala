package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri

sealed trait CurbLoc {
  val uri = Uri.parse("urn:treedata:curbLoc")
  val label: String
}

case object OffsetFromCurb extends CurbLoc{
  val label = "OffsetFromCurb"
}

case object OnCurb extends CurbLoc{
  val label = "OnCurb"
}
