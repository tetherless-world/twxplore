package edu.rpi.tw.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri

sealed trait Health{
  val uri = Uri.parse("urn:treedata:health")
}
case object Fair extends Health
case object Good extends Health
case object Poor extends Health
