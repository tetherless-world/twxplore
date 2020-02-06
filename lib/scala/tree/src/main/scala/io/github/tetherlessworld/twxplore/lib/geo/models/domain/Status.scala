package io.github.tetherlessworld.twxplore.lib.geo.models.domain

sealed trait Status {
  val uri = "urn:treedata:status"
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
