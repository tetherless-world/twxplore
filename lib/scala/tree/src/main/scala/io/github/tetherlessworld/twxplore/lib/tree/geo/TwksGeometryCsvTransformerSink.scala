package io.github.tetherlessworld.twxplore.lib.tree.geo

import edu.rpi.tw.twks.client.RestTwksClient
import edu.rpi.tw.twks.nanopub.Nanopublication
import io.github.tetherlessworld.scena.{Rdf, RdfWriter}
import io.github.tetherlessworld.twxplore.lib.base.stores.TwksStoreConfiguration
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.Feature
import org.apache.jena.rdf.model.ModelFactory

class TwksGeometryCsvTransformerSink(twksStoreConfiguration: TwksStoreConfiguration) extends GeometryCsvTransformerSink {
  private val twksClient = new RestTwksClient(twksStoreConfiguration.twksClientConfiguration)

  override def accept(feature: Feature): Unit = accept[Feature](feature)

  private def accept[T](value: T)(implicit writer: RdfWriter[T]): Unit = {
    val model = ModelFactory.createDefaultModel()
    Rdf.write(model, value)

    val nanopublication = Nanopublication.builder().getAssertionBuilder.setModel(model).getNanopublicationBuilder.build()

    twksClient.putNanopublication(nanopublication)
  }
}
