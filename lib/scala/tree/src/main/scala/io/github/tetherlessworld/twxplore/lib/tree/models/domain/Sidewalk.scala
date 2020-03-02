package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.TREE

sealed trait Sidewalk {
  val uri = TREE.SIDEWALK_URI_PREFIX
  val label: String
}

object Sidewalk {

  case object NoDamage extends Sidewalk {
    val label = "NoDamage"
  }

  case object Damage extends Sidewalk {
    val label = "Damage"
  }

}
