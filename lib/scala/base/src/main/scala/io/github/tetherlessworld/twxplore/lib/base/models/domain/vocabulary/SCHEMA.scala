package io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary

import org.apache.jena.rdf.model.ResourceFactory

object SCHEMA {
  val PREFIX = "schema"
  val URI = "http://schema.org/"

  // Properties
  val address = ResourceFactory.createProperty(URI + "address")
  val addressLocality = ResourceFactory.createProperty(URI + "addressLocality")
  val addressRegion = ResourceFactory.createProperty(URI + "addressRegion")
  val city = ResourceFactory.createProperty(URI + "city")
  val latitude = ResourceFactory.createProperty(URI + "latitude")
  val longitude = ResourceFactory.createProperty(URI + "longitude")
  val postalCode = ResourceFactory.createProperty(URI + "postalCode")
  val state = ResourceFactory.createProperty(URI + "state")
  val polygon = ResourceFactory.createProperty(URI + "polygon")
}
