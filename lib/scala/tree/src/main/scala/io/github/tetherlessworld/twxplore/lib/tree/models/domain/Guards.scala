package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.TREE

sealed trait Guards {
  val uri = Uri.parse(TREE.GUARDS_URI_PREFIX)
}

object Guards {

  case object Helpful extends Guards

  case object Harmful extends Guards

  case object Unsure extends Guards

}
