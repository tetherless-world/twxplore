package edu.rpi.tw.twxplore.lib.geo.models.domain

final case class Borough(borough: String, borocode: Int, ntaList: List[NTA]){
  def addNTA(nta: NTA): Borough = {
    Borough(borough, borocode, ntaList :+ nta)
  }
}

