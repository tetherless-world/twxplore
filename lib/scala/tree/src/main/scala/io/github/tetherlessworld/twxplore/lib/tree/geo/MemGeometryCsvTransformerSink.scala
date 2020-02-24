package io.github.tetherlessworld.twxplore.lib.tree.geo
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.Feature

import scala.collection.mutable

class MemGeometryCsvTransformerSink extends GeometryCsvTransformerSink {
  val featureMap: mutable.HashMap[String, Feature] = new mutable.HashMap()

  override def accept(feature: Feature): Unit = {
    featureMap += (feature.label.get -> feature)
  }
}
