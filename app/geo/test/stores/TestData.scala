package stores

import edu.rpi.tw.twks.uri.Uri
import models.domain.{Feature, Geometry}

object TestData {
  val geometry = Geometry(label = Some("Test geometry"), wkt = "Test WKT", uri = Uri.parse("http://example.com/geometry"))
  val feature = Feature(geometry = geometry, label = Some("Test feature"), uri = Uri.parse("http://example.com/feature"))
}
