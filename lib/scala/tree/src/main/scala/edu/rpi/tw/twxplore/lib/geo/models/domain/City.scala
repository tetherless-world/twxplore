package edu.rpi.tw.twxplore.lib.geo.models.domain

final case class City(name: String, var boroughs: List[Borough], var postcodes: List[Postcode], state: String)
