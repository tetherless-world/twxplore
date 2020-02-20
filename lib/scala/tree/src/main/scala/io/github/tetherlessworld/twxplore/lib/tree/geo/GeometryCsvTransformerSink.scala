package io.github.tetherlessworld.twxplore.lib.tree.geo

import io.github.tetherlessworld.twxplore.lib.geo.models.domain.Feature

trait GeometryCsvTransformerSink {
  def accept(feature: Feature): Unit
}
