package io.github.tetherlessworld.twxplore.lib.geo

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.{Feature, Geometry}

object GeoTestData {
  val geometry = Geometry(label = Some("Test geometry"), wkt = "Test WKT", uri = Uri.parse("http://example.com/geometry"))
  val feature = Feature(geometry = geometry, label = Some("Test feature"), uri = Uri.parse("http://example.com/feature"))
}
