package models.graphql

sealed trait FeatureType

object FeatureType {

  case object MilitaryInstallation extends FeatureType

  case object State extends FeatureType

}
