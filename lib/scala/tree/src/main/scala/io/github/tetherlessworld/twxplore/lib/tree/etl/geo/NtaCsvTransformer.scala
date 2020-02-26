package io.github.tetherlessworld.twxplore.lib.tree.etl.geo

final class NtaCsvTransformer extends GeometryCsvTransformer {
  override protected def parseCsvRow(cols: Seq[String], sink: GeometryCsvTransformerSink): Unit =
    sink.accept(processFeature(cols(5), cols(2), cols(4)))
}
