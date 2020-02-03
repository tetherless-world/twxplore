package edu.rpi.tw.twxplore.lib.geo.models.domain

sealed trait Status {
  val uri = "urn:treedata:status"
}
case object Alive extends Status
case object Dead extends Status
case object Stump extends Status
