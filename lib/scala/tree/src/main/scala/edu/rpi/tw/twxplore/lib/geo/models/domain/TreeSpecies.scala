package edu.rpi.tw.twxplore.lib.geo.models.domain

final case class TreeSpecies(common: String, latin: String) {
  val uri = "urn:treedata:species:" + common
}

