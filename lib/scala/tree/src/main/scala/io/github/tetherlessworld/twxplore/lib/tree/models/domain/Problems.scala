package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import io.github.tetherlessworld.twxplore.lib.tree.models.domain.vocabulary.TREE

sealed trait Problems {
  val uri = TREE.PROBLEMS_URI_PREFIX
}

object Problems {

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

  val values = Seq(BranchLights, BranchOther, BranchShoe, MetalGrates, Stones, TrunkLights, TrunkOther, TrunkWire, RootGrate, RootLights, RootOther, RootStone, Sneakers, WiresRope)
}
