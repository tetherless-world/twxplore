package io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary

import org.apache.jena.rdf.model.ResourceFactory

object SIO {
  val URI = "http://semanticscience.org/resource/"

  // Properties
  val hasAttribute = ResourceFactory.createProperty(URI + "SIO_000008")
  val isAssociatedWith = ResourceFactory.createProperty(URI + "SIO_001403")
  val isSpatioTempRelatedTo = ResourceFactory.createProperty(URI + "SIO_000322")
  val isLocationIn = ResourceFactory.createProperty(URI + "SIO_000061")
  val isLocationOf = ResourceFactory.createProperty(URI + "SIO_000145 ")
  val hasValue = ResourceFactory.createProperty(URI + "SIO_000300")
  val hasUnit = ResourceFactory.createProperty(URI + "SIO_000221")
}
