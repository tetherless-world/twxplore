package models.graphql

case class FeatureQuery(`type`: Option[FeatureType], withinWkt: Option[String])
