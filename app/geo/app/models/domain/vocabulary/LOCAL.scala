package models.domain.vocabulary

import org.apache.jena.rdf.model.ResourceFactory

object LOCAL {
  private val URI_PREFIX = "http://twxplore.github.io/app/geo/"
  val ONTOLOGY_URI = URI_PREFIX + "ontology#"

  // Properties
  val frequency = ResourceFactory.createProperty("frequency")
}
