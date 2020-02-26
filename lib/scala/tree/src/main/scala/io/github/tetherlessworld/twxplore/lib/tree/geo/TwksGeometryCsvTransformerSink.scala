package io.github.tetherlessworld.twxplore.lib.tree.geo

import edu.rpi.tw.twks.api.TwksClient
import edu.rpi.tw.twks.nanopub.Nanopublication
import io.github.tetherlessworld.scena.{Rdf, RdfWriter}
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.Feature
import io.github.tetherlessworld.twxplore.lib.tree.AbstractTwksTransformerSink

final class TwksGeometryCsvTransformerSink(twksClient: TwksClient)
  extends AbstractTwksTransformerSink(twksClient)
    with GeometryCsvTransformerSink {

  override def accept(feature: Feature): Unit = accept[Feature](feature)

  private def accept[T](value: T)(implicit writer: RdfWriter[T]): Unit = {
    val nanopublicationBuilder = Nanopublication.builder()
    Rdf.write(nanopublicationBuilder.getAssertionBuilder.getModel, value)
    val nanopublication = nanopublicationBuilder.build()

    twksClient.putNanopublication(nanopublication)
  }

  override def flush(): Unit = {}
}
