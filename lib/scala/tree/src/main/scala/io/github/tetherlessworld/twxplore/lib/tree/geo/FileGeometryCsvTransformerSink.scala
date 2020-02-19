package io.github.tetherlessworld.twxplore.lib.tree.geo
import java.io.{BufferedWriter, File, FileWriter}

import io.github.tetherlessworld.scena.{Rdf, RdfWriter}
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.Feature
import org.apache.jena.rdf.model.ModelFactory

final class FileGeometryCsvTransformerSink extends GeometryCsvTransformerSink {
  def accept(feature: Feature): Unit = accept(feature.label.get, feature)

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
