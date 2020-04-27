package com.github.raduba.gis

import scala.util.parsing.combinator.JavaTokenParsers

trait ParsedWkt

case class Point2D(x: Double, y: Double) extends ParsedWkt
case class Line(points: List[Point2D]) extends ParsedWkt
case class Polygon(lines: List[Line]) extends ParsedWkt

case class MultiPoint(points: List[Point2D]) extends ParsedWkt
case class MultiLine(lines: List[Line]) extends ParsedWkt
case class MultiPolygon(polygons: List[Polygon]) extends ParsedWkt

object WktParser extends JavaTokenParsers {
  private def number: Parser[Double] = floatingPointNumber ^^ (_.toDouble)

  private def pointTuple: Parser[Point2D] = number ~ number ^^ { case (x ~ y) => Point2D(x, y) }

  private def line: Parser[Line] = "(" ~> ((pointTuple ~ "," ~ pointTuple) ~ rep("," ~> pointTuple)) <~ ")" ^^ {
    case ((p1 ~ "," ~ p2) ~ ps) => Line(List(p1, p2) ++ ps)
  }

  private def multiLine: Parser[List[Line]] = repsep(line, ",")

  private def polyLine: Parser[Polygon] = "(" ~> multiLine <~ ")" ^^ { Polygon }

  def point: Parser[Point2D] = "POINT" ~> "(" ~> pointTuple <~ ")" | "POINT" ~ "EMPTY" ^^ {_ => Point2D(0, 0) }

  def lineString: Parser[Line] = "LINESTRING" ~> line | "LINESTRING" ~ "EMPTY" ^^ {_ => Line(Nil) }

  def polygon: Parser[Polygon] = "POLYGON" ~> polyLine | "POLYGON" ~ "EMPTY" ^^ {_ => Polygon(Nil) }

  def multiPoint: Parser[MultiPoint] = "MULTIPOINT" ~> "(" ~> rep1sep(pointTuple, ",") <~ ")" ^^ { MultiPoint } |
    "MULTIPOINT" ~> "(" ~> rep1sep("(" ~> pointTuple <~ ")", ",") <~ ")" ^^ { MultiPoint } |
    "MULTIPOINT" ~ "EMPTY" ^^ {_ => MultiPoint(Nil) }

  def multiLineString: Parser[MultiLine] = "MULTILINESTRING" ~> "(" ~> multiLine <~ ")" ^^ { MultiLine } |
    "MULTILINESTRING" ~ "EMPTY" ^^ {_ => MultiLine(Nil) }

  def multiPolygon: Parser[MultiPolygon] = "MULTIPOLYGON" ~> "(" ~> rep1sep(polyLine, ",") <~ ")" ^^ { MultiPolygon} |
    "MULTIPOLYGON" ~ "EMPTY" ^^ {_ => MultiPolygon(Nil) }

  def geometry: Parser[ParsedWkt] = point | lineString | polygon | multiPoint | multiLineString | multiPolygon
}
