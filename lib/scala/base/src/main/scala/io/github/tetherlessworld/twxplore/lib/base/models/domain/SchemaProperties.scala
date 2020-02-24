package io.github.tetherlessworld.twxplore.lib.base.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.Schema

trait SchemaProperties extends PropertyGetters with PropertySetters {
  final def address = getPropertyObjectString(Schema.address)
  final def citiesUri = getPropertyObjectUris(Schema.city)
  final def city = getPropertyObjectResourceLabel(Schema.city)
  final def cityUri = getPropertyObjectUri(Schema.city)
  final def latitude = getPropertyObjectFloat(Schema.latitude)
  final def longitude = getPropertyObjectFloat(Schema.longitude)
  final def polygon = getPropertyObjectString(Schema.polygon)
  final def postalCode = Option(getPropertyObjectResourceIdentifier(Schema.state).get.toInt)
  final def postalCodeUri = getPropertyObjectUri(Schema.postalCode)
  final def postalCodesUri = getPropertyObjectUris(Schema.postalCode)
  final def state = getPropertyObjectResourceLabel(Schema.state)
  final def stateUri = getPropertyObjectUri(Schema.state)

  //Setters
  final def address_=(value: String) = setPropertyLiteral(Schema.address, value)
  final def citiesUri_=(uris: List[Uri]) = setPropertyUris(Schema.city, uris)
  final def cityUri_=(uri: Uri) = this.citiesUri = List(uri)
  final def latitude_=(value: Float) = setPropertyLiteral(Schema.latitude, value)
  final def longitude_=(value: Float) = setPropertyLiteral(Schema.longitude, value)
  final def polygon_=(value: String) = addPropertyLiteral(Schema.polygon, value)
  final def postalCodeUri_=(uri: Uri) = this.postalCodesUri = List(uri)
  final def postalCodesUri_=(uris: List[Uri]) = setPropertyUris(Schema.postalCode, uris)
  final def stateUri_=(uri: Uri) = setPropertyUri(Schema.state, uri)
}
