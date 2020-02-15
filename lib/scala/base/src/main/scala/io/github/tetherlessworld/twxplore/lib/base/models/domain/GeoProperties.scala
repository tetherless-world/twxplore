package io.github.tetherlessworld.twxplore.lib.base.models.domain

import edu.rpi.tw.twks.uri.Uri
import org.apache.jena.geosparql.implementation.vocabulary.Geo

trait GeoProperties extends PropertyGetters with PropertySetters {

  final def hasDefaultGeometry = getPropertyObjectUri(Geo.HAS_DEFAULT_GEOMETRY_PROP)

  final def hasDefaultGeometry_=(value: Uri) = setPropertyUri(Geo.HAS_DEFAULT_GEOMETRY_PROP, value)
}
