package models.domain.vocabulary

import org.apache.jena.rdf.model.ResourceFactory

object LOCAL {
  private val URI_PREFIX = "http://twxplore.github.io/app/geo/"
  val ONTOLOGY_URI = URI_PREFIX + "ontology#"

  // Properties
  val frequency = ResourceFactory.createProperty(ONTOLOGY_URI + "frequency")
  val frequencyMaximum = ResourceFactory.createProperty(ONTOLOGY_URI + "frequencyMaximum")
  val frequencyMinimum = ResourceFactory.createProperty(ONTOLOGY_URI + "frequencyMinimum")
  val frequencyUnit = ResourceFactory.createProperty(ONTOLOGY_URI + "frequencyUnit")
  val timestamp = ResourceFactory.createProperty(ONTOLOGY_URI + "timestamp")
  val timestampMaximum = ResourceFactory.createProperty(ONTOLOGY_URI + "timestampMaximum")
  val timestampMinimum = ResourceFactory.createProperty(ONTOLOGY_URI + "timestampMinimum")
  val transmissionPower = ResourceFactory.createProperty(ONTOLOGY_URI + "transmissionPower")
}
