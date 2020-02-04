package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{RdfReader, RdfWriter}
import io.github.tetherlessworld.twxplore.lib.base.models.domain._
import org.apache.jena.rdf.model.{Model, Resource, ResourceFactory}

final case class City(name: String, boroughs: List[Uri], postcodes: List[Uri], state: Uri) {
  val uri = Uri.parse("urn:treedata:city:" + name)

  def addBorough(borough: Borough): City = {
    City(name, boroughs :+ borough.uri, postcodes, state)
  }

  def addPostcode(postcode: Postcode): City = {
    City(name, boroughs, postcodes :+ postcode.uri, state)
  }
}

object City {

  implicit class CityResource(val resource: Resource)
    extends RdfProperties with RdfsProperties with SioProperties with TreeTermsProperties with SchemaProperties

  implicit object CityRdfReader extends RdfReader[City] {
    override def read(resource: Resource): City = {
      City(
        name = resource.label.get,
        boroughs = resource.boroughsUri,
        postcodes = resource.postalCodesUri,
        state = resource.stateUri.get
      )
    }
  }

  implicit object CityRdfWriter extends RdfWriter[City] {
    override def write(model: Model, value: City): Resource = {

      val resource = model.getResource(value.uri.toString) match {
        case null => ResourceFactory.createResource(value.uri.toString)
        case resource => resource
      }

      resource.label = value.name
      resource.stateUri = value.state
      resource.boroughsUri = value.boroughs
      resource.postalCodesUri = value.postcodes
      resource
    }
  }
}
