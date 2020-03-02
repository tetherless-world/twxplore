package io.github.tetherlessworld.twxplore.lib.tree.etl

import com.github.tototoshi.csv.CSVReader

import scala.io.BufferedSource

trait CsvTransformer {
  protected def openCsvReader(filename: String): CSVReader =
    CSVReader.open(openCsvSource(filename))

  protected final def openCsvSource(filename: String): BufferedSource = {
    if (sys.env.contains("CI")) {
      scala.io.Source.fromResource(filename)
    } else {
      var source: BufferedSource = null
      try {
        source = scala.io.Source.fromFile(filename)
        //        source.getLines()
        source
      } catch {
        case _: Throwable => scala.io.Source.fromResource(filename)
      }
    }
  }
}

object CsvTransformer {
  val BufferSizeDefault = 1000
}
