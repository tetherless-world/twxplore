package io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary

import org.apache.jena.rdf.model.ResourceFactory

object Schema {
  val URI = "http://schema.org/"

  val address = ResourceFactory.createProperty(URI + "address")
  val city = ResourceFactory.createProperty(URI + "city")
  val latitude = ResourceFactory.createProperty(URI + "latitude")
  val longitude = ResourceFactory.createProperty(URI + "longitude")
  val postalCode = ResourceFactory.createProperty(URI + "postalCode")
  val state = ResourceFactory.createProperty(URI + "state")

  val cityResource = URI + "city"
}
