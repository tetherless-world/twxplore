package io.github.tetherlessworld.twxplore.lib.tree.stores

import com.google.inject.ImplementedBy
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.Tree
import io.github.tetherlessworld.twxplore.lib.tree.models.selection.{SelectionInput, SelectionResults}

@ImplementedBy(classOf[TwksTreeStore])
trait TreeStore {
  def getTrees(limit: Int, offset: Int): List[Tree]
  def getTreesBySelection(selection: SelectionInput): SelectionResults
}
