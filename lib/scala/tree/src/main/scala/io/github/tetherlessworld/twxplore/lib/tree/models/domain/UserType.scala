package io.github.tetherlessworld.twxplore.lib.geo.models.domain

sealed trait UserType {
  val label: String
}

case object TreesCountStaff extends UserType {
  val label = "TreesCountStaff"
}

case object NYCParksStaff extends UserType {
  val label = "NYCParksStaff"
}

case object Volunteer extends UserType {
  val label = "Volunteer"
}
