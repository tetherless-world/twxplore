package io.github.tetherlessworld.twxplore.lib.tree

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.etl.geo._
import io.github.tetherlessworld.twxplore.lib.tree.etl.tree.{MemTreeCsvTransformerSink, TreeCsvTransformer}

object TestData {

  private val treeSink = new MemTreeCsvTransformerSink
  private val cityGeometrySink = new MemGeometryCsvTransformerSink
  private val boroughGeometrySink = new MemGeometryCsvTransformerSink
  private val ntaGeometrySink = new MemGeometryCsvTransformerSink
  private val blockGeometrySink = new MemGeometryCsvTransformerSink
  new TreeCsvTransformer().parseCsv("tree.csv", treeSink)
  new CityCsvTransformer().parseCsv("city.csv", cityGeometrySink)
  new BoroughCsvTransformer().parseCsv("borough.csv", boroughGeometrySink)
  new NtaCsvTransformer().parseCsv("nta.csv", ntaGeometrySink)
  new BlockCsvTransformer().parseCsv("block.csv", blockGeometrySink)
  val geometry = Geometry(label = Some("Test geometry"), wkt = "Test WKT", uri = Uri.parse("http://example.com/geometry"))
  val treeSpeciesMap: Map[String, TreeSpecies] = treeSink.treeSpeciesMap.toMap
  val boroughMap: Map[Int, Borough] = treeSink.boroughMap.toMap
  val ntaMap: Map[String, Nta] = treeSink.ntaMap.toMap
  val blockMap: Map[Int, Block] = treeSink.blockMap.toMap
  val postalCode: Map[Int, Postcode] = treeSink.postalCode.toMap
  val state: State = treeSink.stateBuffer
  val city: City = treeSink.cityBuffer
  val cityGeoMap = cityGeometrySink.featureMap
  val boroughGeoMap = boroughGeometrySink.featureMap
  val ntaGeoMap = ntaGeometrySink.featureMap
  val blockGeoMap = blockGeometrySink.featureMap
  val treeList = treeSink.treeList.toList
}
