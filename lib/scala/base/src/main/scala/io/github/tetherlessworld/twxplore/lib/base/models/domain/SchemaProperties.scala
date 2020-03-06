package io.github.tetherlessworld.twxplore.lib.base.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{PropertyGetters, PropertySetters}
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.Schema

trait SchemaProperties extends PropertyGetters with PropertySetters {
  final def address = getPropertyObjectStrings(Schema.address).headOption
  final def cityUris = getPropertyObjectResourceUris(Schema.city).map(uri => Uri.parse(uri))
//  final def city = getPropertyObjectResources(Schema.city)
  final def cityUri = getPropertyObjectResourceUris(Schema.city).map(uri => Uri.parse(uri)).headOption
  final def latitude = getPropertyObjectLiterals(Schema.latitude).map(literal => literal.getFloat).headOption
  final def longitude = getPropertyObjectLiterals(Schema.longitude).map(literal => literal.getFloat).headOption
  final def polygon = getPropertyObjectStrings(Schema.polygon).headOption
//  final def postalCode = Option(getPropertyObjectResourceIdentifier(Schema.state).get.toInt)
  final def postalCodeUri = getPropertyObjectResourceUris(Schema.postalCode).map(uri => Uri.parse(uri)).headOption
  final def postalCodeUris = getPropertyObjectResourceUris(Schema.postalCode).map(uri => Uri.parse(uri))
//  final def state = getPropertyObjectResourceLabel(Schema.state)
  final def stateUri = getPropertyObjectResourceUris(Schema.state).map(uri => Uri.parse(uri)).headOption

  //Setters
  final def address_=(value: String) = setPropertyLiteral(Schema.address, value)
  final def cityUris_=(uris: List[Uri]) = setPropertyUris(Schema.city, uris.map(uri => uri.toString))
  final def cityUri_=(uri: Uri) = this.cityUris = List(uri)
  final def latitude_=(value: Float) = setPropertyLiteral(Schema.latitude, value)
  final def longitude_=(value: Float) = setPropertyLiteral(Schema.longitude, value)
  final def polygon_=(value: String) = addPropertyLiteral(Schema.polygon, value)
  final def postalCodeUri_=(uri: Uri) = this.postalCodeUris = List(uri)
  final def postalCodeUris_=(uris: List[Uri]) = setPropertyUris(Schema.postalCode, uris.map(uri => uri.toString))
  final def stateUri_=(uri: Uri) = setPropertyUri(Schema.state, uri.toString)
}
