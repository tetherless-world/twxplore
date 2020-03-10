package io.github.tetherlessworld.twxplore.lib.geo

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.{Feature, FeatureType, Geometry}

object GeoTestData {
  val geometry = Geometry(label = Some("Test geometry"), wkt = "POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))", uri = Uri.parse("http://example.com/geometry"))
  val feature = Feature(geometry = geometry, label = Some("Test feature"), `type` = Some(FeatureType.State), uri = Uri.parse("http://example.com/feature"))
}
