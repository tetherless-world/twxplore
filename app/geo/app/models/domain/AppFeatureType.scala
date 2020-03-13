package models.domain

import edu.rpi.tw.twks.uri.Uri

sealed trait AppFeatureType {
  def uri = Uri.parse("http://twxplore.github.io/app/geo/ontology#" + toString)
}

object AppFeatureType {

  case object MetropolitanDivision extends AppFeatureType
  case object MilitaryInstallation extends AppFeatureType
  case object State extends AppFeatureType
  case object UlsEntity extends AppFeatureType

  val values = List(MetropolitanDivision, MilitaryInstallation, State, UlsEntity)
}
