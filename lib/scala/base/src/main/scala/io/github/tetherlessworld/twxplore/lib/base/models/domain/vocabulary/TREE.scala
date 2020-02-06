package io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary

import org.apache.jena.rdf.model.ResourceFactory

object TREE {
  val URI = "urn:treedata:"
  val resourceURI = URI + "resource:"
  val propertyURI = URI + "property:"
  val createdAt = ResourceFactory.createProperty(propertyURI + "createdAt")
  val dbh = ResourceFactory.createProperty(propertyURI + "dbh")
  val stump = ResourceFactory.createProperty(propertyURI + "stump")
  val block = ResourceFactory.createProperty(propertyURI + "block")
  val curbLoc = ResourceFactory.createProperty(propertyURI + "curbLoc")
  val status = ResourceFactory.createProperty(propertyURI + "status")
  val health = ResourceFactory.createProperty(propertyURI + "health")
  val species = ResourceFactory.createProperty(propertyURI + "species")
  val steward = ResourceFactory.createProperty(propertyURI + "steward")
  val guards = ResourceFactory.createProperty(propertyURI + "guards")
  val sidewalk = ResourceFactory.createProperty(propertyURI + "sidewalk")
  val userType = ResourceFactory.createProperty(propertyURI + "usertype")
  val problems = ResourceFactory.createProperty(propertyURI + "problems")
  val common = ResourceFactory.createProperty(propertyURI + "common")
  val latin = ResourceFactory.createProperty(propertyURI + "latin")
  val address = ResourceFactory.createProperty(propertyURI + "address")
  val postcode = ResourceFactory.createProperty(propertyURI + "postcode")
  val zipCity = ResourceFactory.createProperty(propertyURI + "zipCity")
  val city = ResourceFactory.createProperty(propertyURI + "city")
  val community = ResourceFactory.createProperty(propertyURI + "community")
  val borough = ResourceFactory.createProperty(propertyURI + "borough")
  val cncldist = ResourceFactory.createProperty(propertyURI + "councilDistrict")
  val stateAssembly = ResourceFactory.createProperty(propertyURI + "stateAssembly")
  val stateSenate = ResourceFactory.createProperty(propertyURI + "stateSenate")
  val NTA = ResourceFactory.createProperty(propertyURI + "NTA")
  val boroughCount = ResourceFactory.createProperty(propertyURI + "boroughCount")
  val state = ResourceFactory.createProperty(propertyURI + "state")
  val latitude = ResourceFactory.createProperty(propertyURI + "latitude")
  val longitude = ResourceFactory.createProperty(propertyURI + "longitude")
  val x_sp = ResourceFactory.createProperty(propertyURI + "x_sp")
  val y_sp = ResourceFactory.createProperty(propertyURI + "y_sp")
  val censusTract = ResourceFactory.createProperty(propertyURI + "censusTract")
  val bin = ResourceFactory.createProperty(propertyURI + "bin")
  val bbl = ResourceFactory.createProperty(propertyURI + "bbl")


  val censusTractResource = ResourceFactory.createResource(resourceURI + "censusTract")
  val userTypeResource = ResourceFactory.createResource(resourceURI + "userType")
  val zipCityResource = ResourceFactory.createResource(resourceURI + "zipCity")
  val blockResource = ResourceFactory.createResource(resourceURI + "block")
  val speciesResource = ResourceFactory.createResource(resourceURI + "species")
  val problemsResource = ResourceFactory.createResource(resourceURI + "problems")
  val postcodeResource = ResourceFactory.createResource(resourceURI + "postcode")
  val boroughResource = ResourceFactory.createResource(resourceURI + "borough")
  val NTAResource = ResourceFactory.createResource(resourceURI + "NTA")
  val stateResource = ResourceFactory.createResource(resourceURI + "state")
}
