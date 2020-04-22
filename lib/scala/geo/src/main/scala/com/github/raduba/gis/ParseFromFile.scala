package com.github.raduba.gis

import scala.io.BufferedSource
import scala.util.control.NonFatal
import scala.util.{Failure, Success, Try}

object ParseFromFile {

  def main(args: Array[String]) = {
    if (args.isEmpty) println("Usage: parse <fileName>")
    else {
      val fileName = args.head
      println(s"Parsing file $fileName")
      val parseResult = parse(fileName)
      parseResult match {
        case Success(p) => println(s"Successfully parsed $p of type ${p.getClass.getName}")
        case Failure(e) => println(s"Error on parsing geometry: ${e.getMessage}")
      }
    }
  }

  def parse(fileName: String): Try[Geometry] = {
    var source: BufferedSource = null
    try {
      source = scala.io.Source.fromFile(fileName)
      val wkt = source.mkString
      val parseResult = WKTParser.parse(WKTParser.geometry, wkt)
      parseResult match {
        case WKTParser.Success(p, _) => Success(p)
        case WKTParser.Error(msg, _) => Failure(new Exception(msg))
        case WKTParser.Failure(msg, _) => Failure(new Exception(msg))
      }
    } catch {
      case NonFatal(e) => Failure(e)
    } finally {
      if (source != null) Try(source.close())
    }
  }
}
