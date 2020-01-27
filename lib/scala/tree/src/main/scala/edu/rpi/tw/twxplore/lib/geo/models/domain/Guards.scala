package edu.rpi.tw.twxplore.lib.geo.models.domain

sealed trait Guards
case object Helpful extends Guards
case object Harmful extends Guards