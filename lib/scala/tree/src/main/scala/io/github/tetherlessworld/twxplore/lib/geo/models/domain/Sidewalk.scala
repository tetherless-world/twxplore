package io.github.tetherlessworld.twxplore.lib.geo.models.domain

sealed trait Sidewalk {
  val uri = "urn:treedata:sidewalk"
}

case object NoDamage extends Sidewalk

case object Damage extends Sidewalk

