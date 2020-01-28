package edu.rpi.tw.twxplore.lib.geo.models.domain

import scala.collection.mutable.ListBuffer

case class City(city: String, boroughs: ListBuffer[Borough], postcodes: ListBuffer[Postcode], state: String)
