package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import io.github.tetherlessworld.twxplore.lib.tree.models.domain.vocabulary.TREE

sealed trait Status {
  val uri = TREE.STATUS_URI_PREFIX
}

object Status {

  case object Alive extends Status

  case object Dead extends Status

  case object Stump extends Status

  val values = Seq(Alive, Dead, Stump)
}
