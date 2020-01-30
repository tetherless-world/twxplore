package edu.rpi.tw.twxplore.lib.geo.models.domain

sealed trait Health
case object Fair extends Health
case object Good extends Health
case object Poor extends Health
