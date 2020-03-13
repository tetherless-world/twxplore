package models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.{Feature, Geometry}

final case class AppFeature(
                             //                       dateTimeRange: Option[DateTimeRange],
                             //                       frequencyRange: Option[FrequencyRange],
                             geometry: Geometry,
                             label: Option[String],
                             `type`: Option[AppFeatureType],
                             uri: Uri
                       ) extends Feature
