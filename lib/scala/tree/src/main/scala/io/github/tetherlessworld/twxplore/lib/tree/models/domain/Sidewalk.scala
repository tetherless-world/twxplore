package io.github.tetherlessworld.twxplore.lib.geo.models.domain

sealed trait Sidewalk {
  val uri = "urn:treedata:sidewalk"
  val label: String
}

case object NoDamage extends Sidewalk {
  val label = "NoDamage"
}

case object Damage extends Sidewalk {
  val label = "Damage"
}

