package edu.rpi.tw.twxplore.lib.base.models.domain.vocabulary

import org.apache.jena.rdf.model.ResourceFactory

object TREE {
  val URI = "urn:treedata:"
  val propertyURI = "urn:treedata:property:"

  val dbh = ResourceFactory.createProperty(propertyURI + "dbh")
  val stump = ResourceFactory.createProperty(propertyURI + "stump")
  val block = ResourceFactory.createProperty(propertyURI + "block")//
  val curbLoc = ResourceFactory.createProperty(propertyURI + "curbLoc")
  val status = ResourceFactory.createProperty(propertyURI + "status")
  val health = ResourceFactory.createProperty(propertyURI + "health")
  val species = ResourceFactory.createProperty(propertyURI + "species")//
  val steward = ResourceFactory.createProperty(propertyURI + "steward")
  val guards = ResourceFactory.createProperty(propertyURI + "guards")
  val sidewalk = ResourceFactory.createProperty(propertyURI + "sidewalk")
  val userType = ResourceFactory.createProperty(propertyURI + "usertype")
  val problems = ResourceFactory.createProperty(propertyURI + "problems")//
  val common = ResourceFactory.createProperty(propertyURI + "common")
  val latin = ResourceFactory.createProperty(propertyURI + "latin")
  val address = ResourceFactory.createProperty(propertyURI + "address")
  val postcode = ResourceFactory.createProperty(propertyURI + "postcode")//
  val zipCity = ResourceFactory.createProperty(propertyURI + "zipCity")
  val community = ResourceFactory.createProperty(propertyURI + "community")
  val borough = ResourceFactory.createProperty(propertyURI + "borough")//
  val cncldist = ResourceFactory.createProperty(propertyURI + "councilDistrict")
  val stateAssembly = ResourceFactory.createProperty(propertyURI + "stateAssembly")
  val stateSenate = ResourceFactory.createProperty(propertyURI + "stateSenate")
  val NTA = ResourceFactory.createProperty(propertyURI + "NTA")//
  val boroughCount = ResourceFactory.createProperty(propertyURI + "boroughCount")
  val state = ResourceFactory.createProperty(propertyURI + "state")//
  val latitude = ResourceFactory.createProperty(propertyURI + "latitude")
  val longitude = ResourceFactory.createProperty(propertyURI + "longitude")
  val x_sp = ResourceFactory.createProperty(propertyURI + "x_sp")
  val y_sp = ResourceFactory.createProperty(propertyURI + "y_sp")
  val censusTract = ResourceFactory.createProperty(propertyURI + "censusTract")
  val bin = ResourceFactory.createProperty(propertyURI + "bin")

  val blockResource = ResourceFactory.createResource(URI + "block")
  val speciesResource = ResourceFactory.createResource(URI + "species")
  val problemsResource = ResourceFactory.createResource(URI + "problems")
  val postcodeResource = ResourceFactory.createResource(URI + "postcode")
  val boroughResource = ResourceFactory.createResource(URI + "borough")
  val NTAResource = ResourceFactory.createResource(URI + "NTA")
  val stateResource = ResourceFactory.createResource(URI + "state")
}
