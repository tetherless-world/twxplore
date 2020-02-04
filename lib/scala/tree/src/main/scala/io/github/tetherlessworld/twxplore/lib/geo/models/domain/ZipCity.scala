package io.github.tetherlessworld.twxplore.lib.geo.models.domain

final case class ZipCity(city: String) {
  val uri = "urn:treedata:zipcity:" + city
}
