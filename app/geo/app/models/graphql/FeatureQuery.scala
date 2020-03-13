package models.graphql

import edu.rpi.tw.twks.uri.Uri
import models.domain.FeatureType

case class FeatureQuery(
                         containsFeatureUri: Option[Uri],
                         types: Option[List[FeatureType]],
                         withinFeatureUri: Option[Uri]
                       )
