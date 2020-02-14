package io.github.tetherlessworld.twxplore.lib.tree

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.TREE
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.{Feature, Geometry}

import scala.collection.mutable
import scala.io.BufferedSource

case class BoroughCsvTransformer() {
  private def replaceComma(str: String, startIndex: Int, endIndex: Int): String = {
    str.substring(0, startIndex) + str.substring(startIndex+1, endIndex).replace(",", "+") + str.substring(endIndex+1)
  }
  private def checkSource(filename: String): BufferedSource = {
    var source: BufferedSource = null
    if(sys.env.contains("CI")) {
      source = scala.io.Source.fromResource(filename)
    } else {
      try {
        source = scala.io.Source.fromResource(filename)
        source.getLines.zipWithIndex
      } catch {
        case _:Throwable => source = scala.io.Source.fromFile(filename)
      }
    }
    source
  }
  private var BoroughFeatureMap: mutable.HashMap[Int, Feature] = new mutable.HashMap()

  class FeatureProcessor {
    def processLabel(label: String): Option[String] = Some(label)

    def processFeatureId(id: String): String = id

    def processGeometry(label: String, wkt: String, id: String): Geometry = {
      Geometry(
        label = processLabel(label),
        uri = Uri.parse(TREE.GEOMETRY_URI_PREFIX + ":" + id),
        wkt = wkt
      )
    }

    def processFeature(label: String, wkt: String, id: String): Unit = {
      Feature(
        label = processLabel(label),
        uri = Uri.parse(TREE.FEATURE_URI_PREFIX + ":" + id),
        geometry = processGeometry(label, wkt, id)
      )
    }
  }

  class LineProcessor {
    def process(line: String): Unit = {

    }
  }
}
