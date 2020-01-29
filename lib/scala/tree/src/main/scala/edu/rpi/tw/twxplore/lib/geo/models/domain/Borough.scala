package edu.rpi.tw.twxplore.lib.geo.models.domain

final case class Borough(borough: String, borocode: Int, var ntaList: List[NTA])

