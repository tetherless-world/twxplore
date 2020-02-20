package io.github.tetherlessworld.twxplore.lib.tree

import edu.rpi.tw.twks.client.RestTwksClient
import edu.rpi.tw.twks.nanopub.Nanopublication
import io.github.tetherlessworld.scena.{Rdf, RdfWriter}
import io.github.tetherlessworld.twxplore.lib.base.stores.TwksStoreConfiguration
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import org.apache.jena.rdf.model.ModelFactory

final class TwksTreeCsvTransformerSink(twksStoreConfiguration: TwksStoreConfiguration) extends TreeCsvTransformerSink {
  private val twksClient = new RestTwksClient(twksStoreConfiguration.twksClientConfiguration)

  override def accept(block: Block): Unit = accept[Block](block)
  override def accept(borough: Borough): Unit = accept[Borough](borough)
  override def accept(censusTract: CensusTract): Unit = accept[CensusTract](censusTract)
  override def accept(city: City): Unit = accept[City](city)
  override def accept(nta: Nta): Unit = accept[Nta](nta)
  override def accept(postcode: Postcode): Unit = accept[Postcode](postcode)
  override def accept(species: TreeSpecies): Unit = accept[TreeSpecies](species)
  override def accept(state: State): Unit = accept[State](state)
  override def accept(tree: Tree): Unit = accept[Tree](tree)
  override def accept(zipCity: ZipCity): Unit = accept[ZipCity](zipCity)

  private def accept[T](value: T)(implicit writer: RdfWriter[T]): Unit = {
    val model = ModelFactory.createDefaultModel()
    Rdf.write(model, value)

    val nanopublication = Nanopublication.builder().getAssertionBuilder.setModel(model).getNanopublicationBuilder.build()

    twksClient.putNanopublication(nanopublication)
  }
}
