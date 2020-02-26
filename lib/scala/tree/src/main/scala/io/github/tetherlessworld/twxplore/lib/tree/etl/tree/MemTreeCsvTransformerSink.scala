package io.github.tetherlessworld.twxplore.lib.tree.etl.tree

import io.github.tetherlessworld.twxplore.lib.geo.models.domain._

import scala.collection.mutable
import scala.collection.mutable.ListBuffer

final class MemTreeCsvTransformerSink extends TreeCsvTransformerSink {
  val treeList: ListBuffer[Tree] = new ListBuffer[Tree]()
  val treeSpeciesMap: mutable.HashMap[String, TreeSpecies] = new mutable.HashMap()
  val boroughMap: mutable.HashMap[Int, Borough] = new mutable.HashMap()
  val ntaMap: mutable.HashMap[String, Nta] = new mutable.HashMap()
  val blockMap: mutable.HashMap[Int, Block] = new mutable.HashMap()
  val postalCode: mutable.HashMap[Int, Postcode] = new mutable.HashMap()
  val zipCityMap: mutable.HashMap[String, ZipCity] = new mutable.HashMap()
  val censusTractMap: mutable.HashMap[Int, CensusTract] = new mutable.HashMap()
  var cityBuffer: City = _
  var stateBuffer: State = _

  override def accept(block: Block): Unit = blockMap += (block.id -> block)

  override def accept(borough: Borough): Unit = boroughMap += (borough.borocode -> borough)

  override def accept(censusTract: CensusTract): Unit = censusTractMap += (censusTract.id -> censusTract)

  override def accept(city: City): Unit = cityBuffer = city

  override def accept(nta: Nta): Unit = ntaMap += (nta.nta -> nta)

  override def accept(postcode: Postcode): Unit = postalCode += (postcode.code -> postcode)

  override def accept(species: TreeSpecies): Unit = treeSpeciesMap += (species.common -> species)

  override def accept(state: State): Unit = stateBuffer = state

  override def accept(tree: Tree): Unit = treeList += tree

  override def accept(zipCity: ZipCity): Unit = zipCityMap += (zipCity.city -> zipCity)

  override def flush(): Unit = {}
}
