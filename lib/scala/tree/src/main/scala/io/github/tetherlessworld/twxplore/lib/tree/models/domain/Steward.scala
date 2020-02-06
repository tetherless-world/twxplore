package io.github.tetherlessworld.twxplore.lib.geo.models.domain

sealed trait Steward {
  val uri = "urn:treedata:steward"
  val label: String
}

case object OneOrTwo extends Steward {
  val label = "OneOrTwo"
}

case object ThreeOrFour extends Steward {
  val label = "ThreeOrFour"
}
