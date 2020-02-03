package edu.rpi.tw.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri

sealed trait Guards{
  val uri = Uri.parse("urn:treedata:guards")
}
case object Helpful extends Guards
case object Harmful extends Guards
case object Unsure extends Guards