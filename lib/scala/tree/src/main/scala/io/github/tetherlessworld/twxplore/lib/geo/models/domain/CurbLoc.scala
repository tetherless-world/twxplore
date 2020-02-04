package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri

sealed trait CurbLoc {
  val uri = Uri.parse("urn:treedata:curbLoc")
}

case object OffsetFromCurb extends CurbLoc

case object OnCurb extends CurbLoc
