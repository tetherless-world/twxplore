package io.github.tetherlessworld.twxplore.lib.tree

import io.github.tetherlessworld.twxplore.lib.geo.models.domain._

import scala.collection.mutable

object TestData {
  private val testDataTransformer = TreeDataCsvTransformer()
  private val testData = new MemTreeCsvTransformerSink
  testDataTransformer.parseCsv("test_treedata.csv", testData)
  val treeList = testData.treeList
  var treeSpeciesMap: mutable.HashMap[String, TreeSpecies] = testData.treeSpeciesMap
  var boroughMap: mutable.HashMap[Int, Borough] = testData.boroughMap
  var ntaMap: mutable.HashMap[String, Nta] = testData.ntaMap
  var blockMap: mutable.HashMap[Int, Block] = testData.blockMap
  var postalCode: mutable.HashMap[Int, Postcode] = testData.postalCode
  var city: City = testData.cityBuffer
  var state: State = testData.stateBuffer
}
