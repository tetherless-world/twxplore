package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.TREE

sealed trait Guards {
  val uri = Uri.parse(TREE.GUARDS_URI_PREFIX)
  val label: String
}

case object Helpful extends Guards {
  val label = "Helpful"
}

case object Harmful extends Guards {
  val label = "Harmful"
}

case object Unsure extends Guards {
  val label = "Unsure"
}
