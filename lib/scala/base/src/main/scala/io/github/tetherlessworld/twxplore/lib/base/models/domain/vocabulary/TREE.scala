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
  val zipCity = ResourceFactory.createProperty(propertyURI + "zipCity")
  val community = ResourceFactory.createProperty(propertyURI + "community")
  val borough = ResourceFactory.createProperty(propertyURI + "borough")
  val cncldist = ResourceFactory.createProperty(propertyURI + "councilDistrict")
  val stateAssembly = ResourceFactory.createProperty(propertyURI + "stateAssembly")
  val stateSenate = ResourceFactory.createProperty(propertyURI + "stateSenate")
  val NTA = ResourceFactory.createProperty(propertyURI + "NTA")
  val boroughCount = ResourceFactory.createProperty(propertyURI + "boroughCount")
  val latitude = ResourceFactory.createProperty(propertyURI + "latitude")
  val longitude = ResourceFactory.createProperty(propertyURI + "longitude")
  val x_sp = ResourceFactory.createProperty(propertyURI + "x_sp")
  val y_sp = ResourceFactory.createProperty(propertyURI + "y_sp")
  val censusTract = ResourceFactory.createProperty(propertyURI + "censusTract")
  val bin = ResourceFactory.createProperty(propertyURI + "bin")
  val bbl = ResourceFactory.createProperty(propertyURI + "bbl")

  val TREE_RESOURCE_PREFIX = URI + "resource"
  val TREE_PROPERTY_PREFIX = URI + "property"
  val BLOCK_URI_PREFIX = resourceURI + "block"
  val BOROUGH_URI_PREFIX = resourceURI + "borough"
  val CENSUSTRACT_URI_PREFIX = resourceURI + "censusTract"
  val CITY_URI_PREFIX = resourceURI + "city"
  val CURBLOC_URI_PREFIX = resourceURI + "curbLoc"
  val FEATURE_URI_PREFIX = resourceURI + "feature"
  val GEOMETRY_URI_PREFIX = resourceURI + "geometry"
  val GUARDS_URI_PREFIX = resourceURI + "guards"
  val HEALTH_URI_PREFIX = resourceURI + "health"
  val NTA_URI_PREFIX = resourceURI + "NTA"
  val POSTCODE_URI_PREFIX = resourceURI + "postcode"
  val PROBLEMS_URI_PREFIX = resourceURI + "problems"
  val SIDEWALK_URI_PREFIX = resourceURI + "sidewalk"
  val SPECIES_URI_PREFIX = resourceURI + "species"
  val STATE_URI_PREFIX = resourceURI + "state"
  val STATUS_URI_PREFIX = resourceURI + "status"
  val STEWARD_URI_PREFIX = resourceURI + "steward"
  val TREE_URI_PREFIX = resourceURI + "tree"
  val USERTYPE_URI_PREFIX = resourceURI + "userType"
  val ZIPCITY_URI_PREFIX = resourceURI + "zipCity"

}
