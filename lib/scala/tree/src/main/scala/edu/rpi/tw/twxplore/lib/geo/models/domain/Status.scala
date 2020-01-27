package edu.rpi.tw.twxplore.lib.geo.models.domain

sealed trait Status
case object Alive extends Status
case object Dead extends Status
case object Stump extends Status
