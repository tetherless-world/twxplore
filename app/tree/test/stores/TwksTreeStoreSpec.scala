package stores

import io.github.tetherlessworld.twxplore.lib.tree.TestData
import io.github.tetherlessworld.twxplore.lib.tree.stores.TwksTreeStore
import org.scalatest.{Matchers, WordSpec}

class TwksTreeStoreSpec extends WordSpec with Matchers {
  val store = new TwksTreeStore(TestTwks.twksClient)

  "The TWKS tree store" can {
    "get the first few trees" in {
      val actualTrees = store.getTrees(2, 0)
      for (actualTree <- actualTrees) {
        TestData.treeList should contain(actualTree)
      }
    }
  }
}

