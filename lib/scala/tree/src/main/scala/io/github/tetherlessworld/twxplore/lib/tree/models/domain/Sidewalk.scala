package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import io.github.tetherlessworld.twxplore.lib.tree.models.domain.vocabulary.TREE

sealed trait Sidewalk {
  val uri = TREE.SIDEWALK_URI_PREFIX
}

object Sidewalk {

  case object NoDamage extends Sidewalk

  case object Damage extends Sidewalk

  val values = Seq(NoDamage, Damage)
}
