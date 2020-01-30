package edu.rpi.tw.twxplore.lib.geo.models.domain

final case class State(state: String, cities: List[City]){
  def addCity(city: City): State = {
    State(state, cities :+ city)
  }
}

