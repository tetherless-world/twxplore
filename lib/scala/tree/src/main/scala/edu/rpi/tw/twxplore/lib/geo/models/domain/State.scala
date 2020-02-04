package edu.rpi.tw.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import edu.rpi.tw.twxplore.lib.base.models.domain._
import io.github.tetherlessworld.scena.{RdfReader, RdfWriter}
import org.apache.jena.rdf.model.{Model, Resource, ResourceFactory}

final case class State(state: String, cities: List[Uri]){
  val uri = "urn:treedata:state:" + state
  def addCity(city: City): State = {
    State(state, cities :+ city.uri)
  }
}

object State {
  implicit class BoroughResource(val resource: Resource)
    extends RdfProperties with RdfsProperties with SioProperties with TreeTermsProperties with SchemaProperties with DCTermsProperties

  implicit object StateRdfReader extends RdfReader[State] {
    override def read(resource: Resource): State = {
      State(
        state = resource.label.get,
        cities = resource.citiesUri
      )
    }
  }
  implicit object StateRdfWriter extends RdfWriter[State] {
    override def write(model: Model, value: State): Resource = {
      val resource = model.getResource(value.uri.toString) match {
        case null => ResourceFactory.createResource(value.uri.toString)
        case resource => resource
      }
      resource.label = value.state
      resource.citiesUri = value.cities

      resource
    }
  }
}
