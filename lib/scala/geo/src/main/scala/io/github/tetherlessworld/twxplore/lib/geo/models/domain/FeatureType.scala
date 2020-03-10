package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri

sealed trait FeatureType {
  val uri: Uri
}

object FeatureType {

  case object MilitaryInstallation extends FeatureType {
    val uri = Uri.parse("http://purl.org/twc/dsa/geo/MilitaryInstallation")
  }

  case object State extends FeatureType {
    val uri = Uri.parse("http://schema.org/State")
  }

  val values = List(MilitaryInstallation, State)
}
