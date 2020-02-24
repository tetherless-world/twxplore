package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.TREE

sealed trait Health {
  val uri = Uri.parse(TREE.HEALTH_URI_PREFIX)
  val label: String
}

case object Fair extends Health{
  val label = "Fair"
}

case object Good extends Health{
  val label = "Good"
}

case object Poor extends Health{
  val label = "Poor"
}
