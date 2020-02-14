package io.github.tetherlessworld.twxplore.lib.tree

import io.github.tetherlessworld.twxplore.lib.geo.models.domain._

object TestData {
  private val testDataTransformer = TreeDataCsvTransformer()
  private val testData = new MemTreeCsvTransformerSink
  testDataTransformer.parseCsv("test_treedata.csv", testData)
  val treeList = testData.treeList.toList
  val treeSpeciesMap: Map[String, TreeSpecies] = testData.treeSpeciesMap.toMap
  val boroughMap: Map[Int, Borough] = testData.boroughMap.toMap
  val ntaMap: Map[String, Nta] = testData.ntaMap.toMap
  val blockMap: Map[Int, Block] = testData.blockMap.toMap
  val postalCode: Map[Int, Postcode] = testData.postalCode.toMap
  val state: State = testData.stateBuffer
  val city: City = testData.cityBuffer

}
