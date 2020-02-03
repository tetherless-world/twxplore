package edu.rpi.tw.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import edu.rpi.tw.twxplore.lib.base.models.domain.vocabulary.{SIO, TREE}
import io.github.tetherlessworld.scena.{RdfReader, RdfWriter}
import org.apache.jena.rdf.model.{Resource, ResourceFactory}
import org.apache.jena.vocabulary.{DCTerms, RDFS}

final case class City(name: String, boroughs: List[Int], postcodes: List[Int], state: String){
  val uri = Uri.parse("urn:treedata:city:" + name)
  def addBorough(borough: Borough): City = {
    City(name, boroughs :+ borough.borocode, postcodes, state)
  }

  def addPostcode(postcode: Postcode): City = {
    City(name, boroughs, postcodes :+ postcode.code, state)
  }
}

object City {
  implicit object CityRdfReader extends RdfReader[City] {
    override def read(resource: Resource): City = {
      val boroughResources = resource.listProperties(SIO.isLocationOf)
      val postcodeResources = resource.listProperties(SIO.isAssociatedWith)
      val boroughs = List[Int]()
      val postcodes = List[Int]()
      while(boroughResources.hasNext){
//        boroughs :+ BoroughRdfReader.read(boroughResources.next().getResource()).borocode
        boroughs :+ boroughResources.next().getObject().asResource().getProperty(DCTerms.identifier).getObject.asLiteral().toString
      }
      while(postcodeResources.hasNext){
//        postcodes :+ PostcodeRdfReader.read(boroughResources.next().getResource()).code
        postcodes :+ postcodeResources.next().getObject().asResource().getProperty(DCTerms.identifier).getObject.asLiteral().toString
      }
      City(
        name = resource.getProperty(RDFS.label).getObject.asLiteral().getString,
        boroughs = boroughs,
        postcodes = postcodes,
        state = resource.getProperty(SIO.isLocationIn).getObject.asResource().getProperty(RDFS.label).getObject.asLiteral().getString
      )
    }
  }

  implicit object CityRdfWriter extends RdfWriter[City] {
    override def write(value: City): Resource = {
      val resource = ResourceFactory.createResource(TREE.URI + "City")
      resource.addProperty(RDFS.label, value.name)
      resource.addProperty(SIO.isLocationIn, value.state)
      for(borough <- value.boroughs){
        resource.addProperty(SIO.isLocationOf, ResourceFactory.createResource(TREE.URI + "borough").addProperty(DCTerms.identifier, borough.toString))
      }
      for(postcode <- value.postcodes){
        resource.addProperty(SIO.isAssociatedWith, ResourceFactory.createResource(TREE.URI + "postcode").addProperty(DCTerms.identifier, postcode.toString))
      }
      resource
    }
  }
}
