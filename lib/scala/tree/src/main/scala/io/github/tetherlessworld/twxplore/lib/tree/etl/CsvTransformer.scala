package io.github.tetherlessworld.twxplore.lib.tree

import com.github.tototoshi.csv.CSVReader

import scala.io.BufferedSource

trait CsvTransformer {
  protected def openCsvFile(filename: String): CSVReader = {
    var source: BufferedSource = null
    if (sys.env.contains("CI")) {
      source = scala.io.Source.fromResource(filename)
    } else {
      try {
        source = scala.io.Source.fromResource(filename)
        source.getLines.zipWithIndex
      } catch {
        case _: Throwable => source = scala.io.Source.fromFile(filename)
      }
    }
    CSVReader.open(source)
  }
}
