package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.TREE

sealed trait Status {
  val uri = TREE.STATUS_URI_PREFIX
  val label: String
}

case object Alive extends Status{
  val label = "Alive"
}

case object Dead extends Status{
  val label = "Dead"
}

case object Stump extends Status{
  val label = "Stump"
}
