package io.github.tetherlessworld.twxplore.lib.tree

import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.geo.{CityCsvTransformer, MemGeometryCsvTransformerSink}

object TestData {
  private val testDataTransformer = TreeDataCsvTransformer()
  private val testData = new MemTreeCsvTransformerSink
  private val cityData = new MemGeometryCsvTransformerSink
  testDataTransformer.parseCsv("test_treedata.csv", testData)
  CityCsvTransformer().parseCsv("city.csv", cityData)
  val cityGeoMap = cityData.featureMap
  val treeList = testData.treeList.toList
  val treeSpeciesMap: Map[String, TreeSpecies] = testData.treeSpeciesMap.toMap
  val boroughMap: Map[Int, Borough] = testData.boroughMap.toMap
  val ntaMap: Map[String, Nta] = testData.ntaMap.toMap
  val blockMap: Map[Int, Block] = testData.blockMap.toMap
  val postalCode: Map[Int, Postcode] = testData.postalCode.toMap
  val state: State = testData.stateBuffer
  val city: City = testData.cityBuffer

}
