package io.github.tetherlessworld.twxplore.lib.tree

import io.github.tetherlessworld.twxplore.lib.geo.models.domain._

trait TreeCsvTransformerSink {
  def accept(block: Block): Unit
  def accept(borough: Borough): Unit
  def accept(nta: Nta): Unit
  def accept(postcode: Postcode): Unit
  def accept(zipCity: ZipCity): Unit
  def accept(censusTract: CensusTract): Unit
  def accept(city: City): Unit
  def accept(state: State): Unit
  def accept (species: TreeSpecies): Unit
  def accept(tree: Tree): Unit
}

