package io.github.tetherlessworld.twxplore.lib.tree

import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.geo._

object TestData {
  val cityGeoMap = cityData.featureMap
  val boroughGeoMap = boroughData.featureMap
  val ntaGeoMap = ntaData.featureMap
  val blockGeoMap = blockData.featureMap
  val treeList = testData.treeList.toList

  new TreeDataCsvTransformer().parseCsv("test_treedata.csv", testData)
  new CityCsvTransformer().parseCsv("city.csv", cityData)
  new BoroughCsvTransformer().parseCsv("nybb.csv", boroughData)
  new NtaCsvTransformer().parseCsv("test_ntadata.csv", ntaData)
  new BlockCsvTransformer().parseCsv("test_blockdata.csv", blockData)
  val treeSpeciesMap: Map[String, TreeSpecies] = testData.treeSpeciesMap.toMap
  val boroughMap: Map[Int, Borough] = testData.boroughMap.toMap
  val ntaMap: Map[String, Nta] = testData.ntaMap.toMap
  val blockMap: Map[Int, Block] = testData.blockMap.toMap
  val postalCode: Map[Int, Postcode] = testData.postalCode.toMap
  val state: State = testData.stateBuffer
  val city: City = testData.cityBuffer
  private val testData = new MemTreeCsvTransformerSink
  private val cityData = new MemGeometryCsvTransformerSink
  private val boroughData = new MemGeometryCsvTransformerSink
  private val ntaData = new MemGeometryCsvTransformerSink
  private val blockData = new MemGeometryCsvTransformerSink

}
