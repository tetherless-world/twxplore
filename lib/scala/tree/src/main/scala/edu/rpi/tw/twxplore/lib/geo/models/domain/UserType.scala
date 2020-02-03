package edu.rpi.tw.twxplore.lib.geo.models.domain

sealed trait UserType{
 val uri = "urn:treedata:usertype"
}
case object TreesCountStaff extends UserType
case object NYCParksStaff extends UserType
case object Volunteer extends UserType
