package io.github.tetherlessworld.twxplore.lib.tree.geo

import com.github.tototoshi.csv.CSVReader
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.Feature

import scala.collection.mutable.ListBuffer

final class BoroughCsvTransformer() extends GeometryCsvTransformer {
  var BoroughFeatureList = ListBuffer[Feature]()

  def parseCsv(filename: String, sink: GeometryCsvTransformerSink): Unit = {
    val reader = CSVReader.open(checkSource(filename))
    val lineProcessor = new LineProcessor
    reader.foreach(fields => {
      lineProcessor.process(fields)
    })
    BoroughFeatureList.foreach { case (feature) => {
      sink.accept(feature)
    }
    }
  }

  class LineProcessor {
    def process(cols: Seq[String]): Unit = {
      val featureProcessor = new FeatureProcessor
      val feature = featureProcessor.processFeature(cols(0), cols(1), cols(2))
      BoroughFeatureList += feature
    }
  }

}
