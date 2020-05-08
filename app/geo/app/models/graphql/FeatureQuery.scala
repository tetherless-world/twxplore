package models.graphql

import edu.rpi.tw.twks.uri.Uri
import models.domain.FeatureType

final case class FeatureQuery(
                         containsFeatureUri: Option[Uri],
                         onlyFeatureUri: Option[Uri],
                         types: Option[List[FeatureType]],
                         withinFeatureUri: Option[Uri]
                       )
