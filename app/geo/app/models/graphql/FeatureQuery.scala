package models.graphql

import io.github.tetherlessworld.twxplore.lib.geo.models.domain.FeatureType

case class FeatureQuery(containsWkt: Option[String], `type`: Option[FeatureType], withinWkt: Option[String])
