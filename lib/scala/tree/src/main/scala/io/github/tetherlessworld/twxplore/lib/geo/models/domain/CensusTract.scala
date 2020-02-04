package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri

final case class CensusTract(id: Int, shapefile: String) {
  val uri = Uri.parse("urn:treedata:censusTract:" + id)
}
