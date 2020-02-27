package io.github.tetherlessworld.twxplore.lib.tree.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.Geometry

final case class SelectionGeometry(geometry: Geometry, uri: Uri)
