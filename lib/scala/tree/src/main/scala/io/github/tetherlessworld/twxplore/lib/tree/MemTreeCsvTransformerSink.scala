package io.github.tetherlessworld.twxplore.lib.tree
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.{Block, Tree}

import scala.collection.mutable

final class MemTreeCsvTransformerSink extends TreeCsvTransformerSink {
  private val blocks = mutable.ListBuffer[Block]()

  override def accept(block: Block): Unit = blocks += block

  override def accept(tree: Tree): Unit = {}
}
