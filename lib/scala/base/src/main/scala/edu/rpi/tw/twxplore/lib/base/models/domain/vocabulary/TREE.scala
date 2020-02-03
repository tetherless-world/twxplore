package edu.rpi.tw.twxplore.lib.base.models.domain.vocabulary

import org.apache.jena.rdf.model.ResourceFactory

object TREE {
  val URI = "urn:treedata:"

  val dbh = ResourceFactory.createResource(URI + "dbh")
  val stump = ResourceFactory.createResource(URI + "stump")
  val block = ResourceFactory.createResource(URI + "block")
  val curbLoc = ResourceFactory.createResource(URI + "curbLoc")
  val status = ResourceFactory.createResource(URI + "status")
  val health = ResourceFactory.createResource(URI + "health")
  val species = ResourceFactory.createResource(URI + "species")
  val steward = ResourceFactory.createResource(URI + "steward")
  val guards = ResourceFactory.createResource(URI + "guards")
  val sidewalk = ResourceFactory.createResource(URI + "sidewalk")
  val userType = ResourceFactory.createResource(URI + "usertype")
  val problems = ResourceFactory.createResource(URI + "problems")
  val address = ResourceFactory.createResource(URI + "address")
  val postcode = ResourceFactory.createResource(URI + "postcode")
  val zipCity = ResourceFactory.createResource(URI + "zipCity")
  val community = ResourceFactory.createResource(URI + "community")
  val borough = ResourceFactory.createResource(URI + "borough")
  val cncldist = ResourceFactory.createResource(URI + "councilDistrict")
  val stateAssembly = ResourceFactory.createResource(URI + "stateAssembly")
  val stateSenate = ResourceFactory.createResource(URI + "stateSenate")
  val NTA = ResourceFactory.createResource(URI + "NTA")
  val boroughCount = ResourceFactory.createResource(URI + "boroughCount")
  val state = ResourceFactory.createResource(URI + "state")
  val latitude = ResourceFactory.createResource(URI + "latitude")
  val longitude = ResourceFactory.createResource(URI + "longitude")
  val x_sp = ResourceFactory.createResource(URI + "x_sp")
  val y_sp = ResourceFactory.createResource(URI + "y_sp")
  val censusTract = ResourceFactory.createResource(URI + "censusTract")
  val bin = ResourceFactory.createResource(URI + "bin")
}
