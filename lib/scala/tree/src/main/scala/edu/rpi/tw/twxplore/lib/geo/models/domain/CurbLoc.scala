package edu.rpi.tw.twxplore.lib.geo.models.domain

sealed trait CurbLoc
case object OffsetFromCurb extends CurbLoc
case object OnCurb extends CurbLoc
