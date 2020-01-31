package edu.rpi.tw.twxplore.lib.geo.models.domain

import edu.rpi.tw.twxplore.lib.base.models.domain.vocabulary.{SIO, TREE}
import edu.rpi.tw.twxplore.lib.geo.models.domain.City.CityRdfReader
import io.github.tetherlessworld.scena.{RdfReader, RdfWriter}
import org.apache.jena.rdf.model.{Resource, ResourceFactory}
import org.apache.jena.vocabulary.DCTerms

final case class Postcode(code: Int, city: String)

object Postcode {
  implicit object PostcodeRdfReader extends RdfReader[Postcode] {
    override def read(resource: Resource): Postcode = {
      Postcode(
        code = resource.getProperty(DCTerms.identifier).getObject().asLiteral().getInt,
        city = CityRdfReader.read(resource.getProperty(SIO.isAssociatedWith).getResource()).name
      )
    }
  }
  implicit object PostcodeRdfWriter extends RdfWriter[Postcode] {
    override def write(value: Postcode): Resource = {
      val resource = ResourceFactory.createResource(TREE.URI + "Postcode")
      resource.addProperty(SIO.isAssociatedWith, value.city)
      resource
    }
  }
}