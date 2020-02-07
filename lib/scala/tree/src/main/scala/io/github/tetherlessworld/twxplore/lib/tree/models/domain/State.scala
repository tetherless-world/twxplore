package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{RdfReader, RdfWriter}
import io.github.tetherlessworld.twxplore.lib.base.models.domain._
import org.apache.jena.rdf.model.{Model, Resource, ResourceFactory}

final case class State(name: String, cities: List[Uri]) {
  val uri = Uri.parse("urn:treedata:resource:state:" + name)

  def addCity(city: City): State = {
    State(name, cities :+ city.uri)
  }
}

object State {
  implicit class StateResource(val resource: Resource)
    extends RdfProperties with RdfsProperties with SioProperties with TreeTermsProperties with SchemaProperties with DCTermsProperties

  implicit object StateRdfReader extends RdfReader[State] {
    override def read(resource: Resource): State = {
      println(resource)
      State(
        name = resource.label.get,
        cities = resource.citiesUri
      )
    }
  }
  implicit object StateRdfWriter extends RdfWriter[State] {
    override def write(model: Model, value: State): Resource = {
      val resource = Option(model.getResource(value.uri.toString))
        .getOrElse(ResourceFactory.createResource(value.uri.toString))
      resource.label = value.name
      resource.citiesUri = value.cities

      resource
    }
  }
}
