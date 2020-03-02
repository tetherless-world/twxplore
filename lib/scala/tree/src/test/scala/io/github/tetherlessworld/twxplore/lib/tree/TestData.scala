package io.github.tetherlessworld.twxplore.lib.tree

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.etl.geo._
import io.github.tetherlessworld.twxplore.lib.tree.etl.tree.{MemTreeCsvTransformerSink, TreeCsvTransformer}

object TestData {

  private val testData = new MemTreeCsvTransformerSink
  private val cityData = new MemGeometryCsvTransformerSink
  private val boroughData = new MemGeometryCsvTransformerSink
  private val ntaData = new MemGeometryCsvTransformerSink
  private val blockData = new MemGeometryCsvTransformerSink
  new TreeCsvTransformer().parseCsv("tree.csv", testData)
  new CityCsvTransformer().parseCsv("city.csv", cityData)
  new BoroughCsvTransformer().parseCsv("borough.csv", boroughData)
  new NtaCsvTransformer().parseCsv("nta.csv", ntaData)
  new BlockCsvTransformer().parseCsv("block.csv", blockData)
  val geometry = Geometry(label = Some("Test geometry"), wkt = "Test WKT", uri = Uri.parse("http://example.com/geometry"))
  val treeSpeciesMap: Map[String, TreeSpecies] = testData.treeSpeciesMap.toMap
  val boroughMap: Map[Int, Borough] = testData.boroughMap.toMap
  val ntaMap: Map[String, Nta] = testData.ntaMap.toMap
  val blockMap: Map[Int, Block] = testData.blockMap.toMap
  val postalCode: Map[Int, Postcode] = testData.postalCode.toMap
  val state: State = testData.stateBuffer
  val city: City = testData.cityBuffer
  val cityGeoMap = cityData.featureMap
  val boroughGeoMap = boroughData.featureMap
  val ntaGeoMap = ntaData.featureMap
  val blockGeoMap = blockData.featureMap
  val treeList = testData.treeList.toList
}
