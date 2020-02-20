package io.github.tetherlessworld.twxplore.lib.tree.geo

import com.github.tototoshi.csv.CSVReader
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.Feature

import scala.collection.mutable.ListBuffer

case class CityCsvTransformer() extends GeometryCsvTransformer {
  var CityFeatureList =  ListBuffer[Feature]()

  class LineProcessor {
    def process(cols: Seq[String]): Unit = {
      val featureProcessor = new FeatureProcessor
      if (cols(3) == "New York") {
        val feature = featureProcessor.processFeature(cols(3), cols(0), cols(3))
        CityFeatureList += feature
      }
    }
  }

  def parseCsv(filename: String, sink: GeometryCsvTransformerSink): Unit = {
    val reader = CSVReader.open(checkSource(filename))
    val lineProcessor = new LineProcessor
    reader.foreach(fields => {
      lineProcessor.process(fields)
    })
    CityFeatureList.foreach{case (feature) => {
      sink.accept(feature)
    }}
  }
}
