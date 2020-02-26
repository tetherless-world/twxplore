package io.github.tetherlessworld.twxplore.lib.tree.etl.geo

import io.github.tetherlessworld.twxplore.lib.geo.models.domain.Feature
import io.github.tetherlessworld.twxplore.lib.tree.etl.TransformerSink

trait GeometryCsvTransformerSink extends TransformerSink {
  def accept(feature: Feature): Unit
}
