package edu.rpi.tw.twxplore.lib.geo.models.domain

final case class ZipCity(city: String){
  val uri = "urn:treedata:zipcity:" + city
}