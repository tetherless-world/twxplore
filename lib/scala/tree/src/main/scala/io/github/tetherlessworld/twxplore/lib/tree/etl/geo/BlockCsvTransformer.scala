package io.github.tetherlessworld.twxplore.lib.tree.etl.geo

final class BlockCsvTransformer extends GeometryCsvTransformer {
  override protected def parseCsvRow(cols: Seq[String], sink: GeometryCsvTransformerSink): Unit =
    sink.accept(processFeature(cols(1), cols(0), cols(1)))
}
