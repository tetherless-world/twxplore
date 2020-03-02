package io.github.tetherlessworld.twxplore.lib.tree.etl.geo

import io.github.tetherlessworld.twxplore.lib.geo.models.domain.Feature

import scala.collection.mutable

final class MemGeometryCsvTransformerSink extends GeometryCsvTransformerSink {
  val featureMap: mutable.HashMap[String, Feature] = new mutable.HashMap()

  override def accept(feature: Feature): Unit = {
    featureMap += (feature.label.get -> feature)
  }

  override def flush(): Unit = {}
}