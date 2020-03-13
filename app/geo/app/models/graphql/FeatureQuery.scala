package models.graphql

import edu.rpi.tw.twks.uri.Uri
import models.domain.AppFeatureType

case class FeatureQuery(
                         containsFeatureUri: Option[Uri],
                         types: Option[List[AppFeatureType]],
                         withinFeatureUri: Option[Uri]
                       )
