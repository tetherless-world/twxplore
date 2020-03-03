package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{RdfReader, RdfWriter}
import io.github.tetherlessworld.twxplore.lib.base.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.models.domain.TreeProperties
import io.github.tetherlessworld.twxplore.lib.tree.models.domain.vocabulary.TREE
import org.apache.jena.rdf.model.{Model, Resource, ResourceFactory}

final case class City(name: String, boroughs: List[Uri], postcodes: List[Uri], state: Uri, feature: Uri, uri: Uri) {
  def addBorough(borough: Borough): City = {
    this.copy(boroughs = boroughs :+ borough.uri)
  }

  def addPostcode(postcode: Postcode): City = {
    this.copy(postcodes = postcodes :+ postcode.uri)
  }
}

object City {

  implicit class CityResource(val resource: Resource)
    extends RdfProperties with RdfsProperties with SioProperties with TreeProperties with SchemaProperties with GeoProperties

  implicit object CityRdfReader extends RdfReader[City] {
    override def read(resource: Resource): City = {
      City(
        name = resource.label.get,
        boroughs = resource.boroughsUri,
        postcodes = resource.postalCodesUri,
        state = resource.stateUri.get,
        uri = Uri.parse(resource.getURI),
        feature = resource.spatialDimensionProp.get
      )
    }
  }

  implicit object CityRdfWriter extends RdfWriter[City] {
    override def write(model: Model, value: City): Resource = {
      val resource = Option(model.getResource(value.uri.toString))
        .getOrElse(ResourceFactory.createResource(value.uri.toString))

      resource.label = value.name
      resource.stateUri = value.state
      resource.boroughsUri = value.boroughs
      resource.postalCodesUri = value.postcodes
      resource.spatialDimensionProp = value.feature
      resource.`type` = ResourceFactory.createResource(TREE.CITY_URI_PREFIX)
      resource
    }
  }

}
