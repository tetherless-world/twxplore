package io.github.tetherlessworld.twxplore.lib.geo.models.domain

sealed trait Steward {
  val uri = "urn:treedata:steward"
}

case object OneOrTwo extends Steward

case object ThreeOrFour extends Steward
