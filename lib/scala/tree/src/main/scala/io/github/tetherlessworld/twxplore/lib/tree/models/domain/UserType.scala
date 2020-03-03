package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import io.github.tetherlessworld.twxplore.lib.tree.models.domain.vocabulary.TREE

sealed trait UserType {
  val uri = TREE.userType
}

object UserType {

  case object TreesCountStaff extends UserType

  case object NYCParksStaff extends UserType

  case object Volunteer extends UserType

  val values = Seq(TreesCountStaff, NYCParksStaff, Volunteer)
}
