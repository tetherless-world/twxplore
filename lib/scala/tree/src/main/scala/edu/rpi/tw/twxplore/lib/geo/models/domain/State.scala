package edu.rpi.tw.twxplore.lib.geo.models.domain

import edu.rpi.tw.twxplore.lib.base.models.domain.vocabulary.{SIO, TREE}
import io.github.tetherlessworld.scena.{RdfReader, RdfWriter}
import org.apache.jena.rdf.model.{Resource, ResourceFactory}
import org.apache.jena.vocabulary.RDFS

final case class State(state: String, cities: List[String]){
  def addCity(city: City): State = {
    State(state, cities :+ city.name)
  }
}

object State {
  implicit object StateRdfReader extends RdfReader[State] {
    override def read(resource: Resource): State = {
      val cityResources = resource.listProperties(SIO.isLocationOf)
      val cities = List[String]()
      while(cityResources.hasNext) {
        cities :+ cityResources.next.getResource.getProperty(RDFS.label).getLiteral().getString
      }
      State(
        state = resource.getProperty(RDFS.label).getObject.asLiteral().getString,
        cities = cities
      )
    }
  }
  implicit object StateRdfWriter extends RdfWriter[State] {
    override def write(value: State): Resource = {
      val resource = ResourceFactory.createResource(TREE.URI + "State")
      resource.addProperty(RDFS.label, value.state)
      for( city <- value.cities) {
        resource.addProperty(SIO.isLocationOf, ResourceFactory.createResource(TREE.URI + "City")).addProperty(RDFS.label, city)
      }
      resource
    }
  }
}
