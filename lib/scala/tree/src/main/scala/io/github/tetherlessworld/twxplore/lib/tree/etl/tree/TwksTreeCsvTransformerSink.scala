package io.github.tetherlessworld.twxplore.lib.tree.etl.tree

import edu.rpi.tw.twks.api.TwksClient
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.etl.AbstractTwksTransformerSink

final class TwksTreeCsvTransformerSink(twksClient: TwksClient)
  extends AbstractTwksTransformerSink(twksClient)
    with TreeCsvTransformerSink {
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
}
