package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri

sealed trait FeatureType {
  def uri = Uri.parse("http://twxplore.github.io/app/geo/ontology#" + toString)
}

object FeatureType {

  case object MetropolitanDivision extends FeatureType
  case object MilitaryInstallation extends FeatureType
  case object State extends FeatureType

  val values = List(MetropolitanDivision, MilitaryInstallation, State)
}
