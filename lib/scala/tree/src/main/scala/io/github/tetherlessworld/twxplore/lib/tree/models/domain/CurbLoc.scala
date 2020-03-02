package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.TREE

sealed trait CurbLoc {
  val uri = Uri.parse(TREE.CURBLOC_URI_PREFIX)
}

object CurbLoc {

  case object OffsetFromCurb extends CurbLoc

  case object OnCurb extends CurbLoc

}
