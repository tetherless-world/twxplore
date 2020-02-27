package io.github.tetherlessworld.twxplore.lib.tree.etl.geo

import io.github.tetherlessworld.twxplore.lib.tree.etl.CsvTransformer

final class BlockCsvTransformer(bufferSize: Int = CsvTransformer.BufferSizeDefault) extends GeometryCsvTransformer(bufferSize) {
  override protected def parseCsvRow(cols: Seq[String], sink: GeometryCsvTransformerSink): Unit =
    sink.accept(processFeature(cols(1), cols(0), cols(1)))
}
