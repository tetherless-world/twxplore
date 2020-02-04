package io.github.tetherlessworld.twxplore.lib.geo.models.domain

sealed trait Problems {
  val uri = "urn:treedata:problems"
}

case object BranchLights extends Problems
case object BranchOther extends Problems
case object BranchShoe extends Problems
case object MetalGrates extends Problems
case object Stones extends Problems
case object TrunkLights extends Problems
case object TrunkOther extends Problems
case object TrunkWire extends Problems
case object RootGrate extends Problems
case object RootLights extends Problems
case object RootOther extends Problems
case object RootStone extends Problems
case object Sneakers extends Problems
case object WiresRope extends Problems
