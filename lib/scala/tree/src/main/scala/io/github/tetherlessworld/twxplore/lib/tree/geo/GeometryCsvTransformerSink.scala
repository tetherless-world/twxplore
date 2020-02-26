package io.github.tetherlessworld.twxplore.lib.tree.geo

import io.github.tetherlessworld.twxplore.lib.geo.models.domain.Feature
import io.github.tetherlessworld.twxplore.lib.tree.TransformerSink

trait GeometryCsvTransformerSink extends TransformerSink {
  def accept(feature: Feature): Unit
}
