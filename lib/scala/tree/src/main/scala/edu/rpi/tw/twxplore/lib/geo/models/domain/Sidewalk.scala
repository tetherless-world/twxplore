package edu.rpi.tw.twxplore.lib.geo.models.domain

sealed trait Sidewalk
case object NoDamage extends Sidewalk
case object Damage extends Sidewalk

