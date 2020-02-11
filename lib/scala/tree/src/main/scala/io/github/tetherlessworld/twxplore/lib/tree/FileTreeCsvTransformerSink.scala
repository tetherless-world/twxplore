package io.github.tetherlessworld.twxplore.lib.tree
import java.io.{BufferedWriter, File, FileWriter}

import io.github.tetherlessworld.scena.{Rdf, RdfWriter}
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.{Block, Tree}
import org.apache.jena.rdf.model.ModelFactory

final class FileTreeCsvTransformerSink extends TreeCsvTransformerSink {
  override def accept(block: Block): Unit = accept("block-" + block.id, block)

  override def accept(tree: Tree): Unit = accept("tree-" + tree.id, tree)

  private def accept[T](fileBaseName: String, value: T)(implicit writer: RdfWriter[T]): Unit = {
    val file = new File(s"./testdata/${fileBaseName.replace(" ", "_")}.ttl")
    if(!file.exists()) {
      file.createNewFile()
    }

    val model = ModelFactory.createDefaultModel()
    Rdf.write(model, value)

    val fileWriter = new BufferedWriter(new FileWriter(file))
    try {
      model.write(fileWriter, "TURTLE")
    } finally {
      fileWriter.close()
    }
  }
}
