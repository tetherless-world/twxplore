package io.github.tetherlessworld.twxplore.lib.tree

import io.github.tetherlessworld.twxplore.lib.geo.models.domain._

import scala.collection.mutable

object TestData {
  private val testData = TreeDataCsvTransformer()
  testData.parseCsv("test_treedata.csv", new TreeCsvTransformerSink {})
  val treeList = testData.treeList
  var treeMap: mutable.HashMap[Int, Tree] = testData.treeMap
  var treeSpeciesMap: mutable.HashMap[String, TreeSpecies] = testData.treeSpeciesMap
  var boroughMap: mutable.HashMap[Int, Borough] = testData.boroughMap
  var ntaMap: mutable.HashMap[String, Nta] = testData.ntaMap
  var blockMap: mutable.HashMap[Int, Block] = testData.blockMap
  var postalCode: mutable.HashMap[Int, Postcode] = testData.postalCode
  var city: City = testData.city
  var state: State = testData.state
}
