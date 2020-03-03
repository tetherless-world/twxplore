package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import io.github.tetherlessworld.twxplore.lib.tree.models.domain.vocabulary.TREE

sealed trait Steward {
  val uri = TREE.STEWARD_URI_PREFIX
}

object Steward {

  case object OneOrTwo extends Steward

  case object ThreeOrFour extends Steward

  val values = Seq(OneOrTwo, ThreeOrFour)
}
