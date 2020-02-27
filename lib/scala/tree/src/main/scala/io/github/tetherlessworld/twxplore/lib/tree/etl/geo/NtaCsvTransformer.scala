package io.github.tetherlessworld.twxplore.lib.tree.etl.geo

import io.github.tetherlessworld.twxplore.lib.tree.etl.CsvTransformer

final class NtaCsvTransformer(bufferSize: Int = CsvTransformer.BufferSizeDefault) extends GeometryCsvTransformer(bufferSize) {
  override protected def parseCsvRow(cols: Seq[String], sink: GeometryCsvTransformerSink): Unit =
    sink.accept(processFeature(cols(5), cols(2), cols(4)))
}
