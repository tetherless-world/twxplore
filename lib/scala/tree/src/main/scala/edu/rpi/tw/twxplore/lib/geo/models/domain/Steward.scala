package edu.rpi.tw.twxplore.lib.geo.models.domain

sealed trait Steward
case object OneOrTwo extends Steward
case object ThreeOrFour extends Steward
