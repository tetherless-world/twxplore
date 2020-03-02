package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.TREE

sealed trait Health {
  val uri = Uri.parse(TREE.HEALTH_URI_PREFIX)
}

object Health {

  case object Fair extends Health

  case object Good extends Health

  case object Poor extends Health

}
