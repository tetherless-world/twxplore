package edu.rpi.tw.twxplore.lib.base.models.domain.vocabulary

import org.apache.jena.rdf.model.ResourceFactory

object Schema {
  val URI = "http://schema.org/"

  val postalCode = ResourceFactory.createProperty(URI + "postalCode")
  val state = ResourceFactory.createProperty(URI + "state")
  val city = ResourceFactory.createProperty(URI + "city")
}
