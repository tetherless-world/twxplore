package io.github.tetherlessworld.twxplore.lib.tree.etl.geo

import io.github.tetherlessworld.twxplore.lib.tree.etl.CsvTransformer

final class CityCsvTransformer(bufferSize: Int = CsvTransformer.BufferSizeDefault) extends GeometryCsvTransformer(bufferSize) {
  override protected def parseCsvRow(cols: Seq[String], sink: GeometryCsvTransformerSink): Unit =
    if (cols(3) == "New York") {
      sink.accept(processFeature(cols(3), cols(0), cols(3)))
    }
}
