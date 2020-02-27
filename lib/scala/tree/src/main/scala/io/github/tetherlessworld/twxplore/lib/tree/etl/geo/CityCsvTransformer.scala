package io.github.tetherlessworld.twxplore.lib.tree.etl.geo

final class CityCsvTransformer extends GeometryCsvTransformer {
  override protected def parseCsvRow(cols: Seq[String], sink: GeometryCsvTransformerSink): Unit =
    if (cols(3) == "New York") {
      sink.accept(processFeature(cols(3), cols(0), cols(3)))
    }
}
