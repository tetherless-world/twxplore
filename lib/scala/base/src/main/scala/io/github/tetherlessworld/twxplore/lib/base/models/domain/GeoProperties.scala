package io.github.tetherlessworld.twxplore.lib.base.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{PropertyGetters, PropertySetters}
import org.apache.jena.geosparql.implementation.vocabulary.Geo

trait GeoProperties extends PropertyGetters with PropertySetters {

  final def spatialDimensionProp = getPropertyObjectResourceUris(Geo.SPATIAL_DIMENSION_PROP).map(uri => Uri.parse(uri)).headOption

  final def spatialDimensionProp_=(value: Uri) = setPropertyUri(Geo.SPATIAL_DIMENSION_PROP, value.toString)

  final def hasDefaultGeometry = getPropertyObjectResourceUris(Geo.HAS_DEFAULT_GEOMETRY_PROP).map(uri => Uri.parse(uri)).headOption

  final def hasDefaultGeometry_=(value: Uri) = setPropertyUri(Geo.HAS_DEFAULT_GEOMETRY_PROP, value.toString)
}
