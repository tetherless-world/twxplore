package io.github.tetherlessworld.twxplore.lib.tree.etl.geo

import edu.rpi.tw.twks.api.TwksClient
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.Feature
import io.github.tetherlessworld.twxplore.lib.tree.etl.AbstractTwksTransformerSink

final class TwksGeometryCsvTransformerSink(twksClient: TwksClient)
  extends AbstractTwksTransformerSink(twksClient)
    with GeometryCsvTransformerSink {

  override def accept(feature: Feature): Unit = accept[Feature](feature)
}
