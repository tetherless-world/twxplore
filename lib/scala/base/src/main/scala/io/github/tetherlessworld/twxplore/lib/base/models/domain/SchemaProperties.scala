package io.github.tetherlessworld.twxplore.lib.base.models.domain

import io.github.tetherlessworld.scena.{PropertyGetters, PropertySetters}
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.SCHEMA

trait SchemaProperties extends PropertyGetters with PropertySetters {
  final def addAddressRegion(value: String) = addPropertyLiterals(SCHEMA.addressRegion, List(value))
  final def addressLocality = addressLocalities.headOption
  final def addressLocality_=(value: String) = setPropertyLiterals(SCHEMA.addressLocality, List(value))
  final def addressLocalities = getPropertyObjectStrings(SCHEMA.addressLocality)
  final def addressRegion = addressRegions.headOption
  final def addressRegion_=(value: String) = setPropertyLiterals(SCHEMA.addressRegion, List(value))
  final def addressRegions = getPropertyObjectStrings(SCHEMA.addressRegion)
  final def postalCode = postalCodes.headOption
  final def postalCode_=(value: String) = setPropertyLiterals(SCHEMA.postalCode, List(value))
  final def postalCodes = getPropertyObjectStrings(SCHEMA.postalCode)
}
