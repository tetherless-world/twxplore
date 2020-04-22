package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import com.github.raduba.gis.ParsedWkt
import edu.rpi.tw.twks.uri.Uri

final case class ParsedGeometry(label: Option[String], parsedWkt: ParsedWkt, uri: Uri, wkt: String) extends Geometry
