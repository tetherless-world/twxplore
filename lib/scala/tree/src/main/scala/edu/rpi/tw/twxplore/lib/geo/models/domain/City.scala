package edu.rpi.tw.twxplore.lib.geo.models.domain

final case class City(name: String, boroughs: List[Borough], postcodes: List[Postcode], state: String){
  def addBorough(borough: Borough): City = {
    City(name, boroughs :+ borough, postcodes, state)
  }

  def addPostcode(postcode: Postcode): City = {
    City(name, boroughs, postcodes :+ postcode, state)
  }
}
