package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.TREE

sealed trait Problems {
  val uri = TREE.PROBLEMS_URI_PREFIX
  val label: String
}

case object BranchLights extends Problems {
  val label = "BranchLights"
}
case object BranchOther extends Problems {
  val label = "BranchOther"
}
case object BranchShoe extends Problems {
  val label = "BranchShoe"
}
case object MetalGrates extends Problems {
  val label = "MetalGrates"
}
case object Stones extends Problems {
  val label = "Stones"
}
case object TrunkLights extends Problems {
  val label = "TrunkLights"
}
case object TrunkOther extends Problems {
  val label = "TrunkOther"
}
case object TrunkWire extends Problems {
  val label = "TrunkWire"
}
case object RootGrate extends Problems {
  val label = "RootGrate"
}
case object RootLights extends Problems {
  val label = "RootLights"
}
case object RootOther extends Problems {
  val label = "RootOther"
}
case object RootStone extends Problems {
  val label = "RootStone"
}
case object Sneakers extends Problems {
  val label = "Sneakers"
}
case object WiresRope extends Problems {
  val label = "WiresRope"
}
