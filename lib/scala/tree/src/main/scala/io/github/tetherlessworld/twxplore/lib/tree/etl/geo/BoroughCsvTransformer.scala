package io.github.tetherlessworld.twxplore.lib.tree.etl.geo

final class BoroughCsvTransformer extends GeometryCsvTransformer {
  override protected def parseCsvRow(cols: Seq[String], sink: GeometryCsvTransformerSink): Unit =
    sink.accept(processFeature(cols(0), cols(1), cols(2)))
}
