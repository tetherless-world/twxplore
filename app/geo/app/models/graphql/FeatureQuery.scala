package models.graphql

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.FeatureType

case class FeatureQuery(
                         containsFeatureUri: Option[Uri],
                         types: Option[List[FeatureType]],
                         withinFeatureUri: Option[Uri]
                       )
