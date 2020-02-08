package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.TREE

sealed trait Steward {
  val uri = TREE.STEWARD_URI_PREFIX
  val label: String
}

case object OneOrTwo extends Steward {
  val label = "OneOrTwo"
}

case object ThreeOrFour extends Steward {
  val label = "ThreeOrFour"
}
