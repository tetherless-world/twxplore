package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.TREE

sealed trait UserType {
  val uri = TREE.userType
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
