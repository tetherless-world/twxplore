package io.github.tetherlessworld.twxplore.lib.tree.etl.geo

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.TREE
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.{Feature, Geometry}
import io.github.tetherlessworld.twxplore.lib.tree.etl.CsvTransformer

abstract class GeometryCsvTransformer(bufferSize: Int) extends CsvTransformer {
  final def parseCsv(filename: String, sink: GeometryCsvTransformerSink): Unit = {
    val reader = openCsvReader(filename)
    try {
      for ((cols, rowIndex) <- reader.toStream.zipWithIndex) {
        parseCsvRow(cols, sink)
        if (rowIndex > 0 && rowIndex % bufferSize == 0) {
          sink.flush()
        }
      }
    } finally {
      reader.close()
    }
    sink.flush()
  }

  protected def parseCsvRow(cols: Seq[String], sink: GeometryCsvTransformerSink): Unit

  protected final def processLabel(label: String): Option[String] = Some(label)

  protected final def processFeatureId(id: String): String = id

  protected final def processGeometry(label: String, wkt: String, id: String): Geometry = {
    Geometry(
      label = processLabel(label),
      uri = Uri.parse(TREE.GEOMETRY_URI_PREFIX + ":" + label.replace(" ", "_")),
      wkt = wkt
    )
  }

  protected final def processFeature(label: String, wkt: String, id: String): Feature = {
    Feature(
      label = processLabel(label),
      uri = Uri.parse(TREE.FEATURE_URI_PREFIX + ":" + label.replace(" ", "_")),
      geometry = processGeometry(label, wkt, id)
    )
  }
}
