package io.github.tetherlessworld.twxplore.lib.tree.stores

import io.github.tetherlessworld.twxplore.lib.tree.TreeTestData
import org.scalatest.{Matchers, WordSpec}

class TwksTreeStoreSpec extends WordSpec with Matchers {
  val store = new TwksTreeStore(TestTwks.twksClient)

  "The TWKS tree store" can {
    "get the first few trees" in {
      val actualTrees = store.getTrees(2, 0)
      for (actualTree <- actualTrees) {
        TreeTestData.treeList should contain(actualTree)
      }
    }
  }
}

