package stores

import io.github.tetherlessworld.twxplore.lib.geo.models.domain.Tree
import io.github.tetherlessworld.twxplore.lib.tree.TestData

object TestStore extends Store {
  override def getTrees(limit: Int, offset: Int): List[Tree] = if (offset == 0) TestData.treeList else List()
}
