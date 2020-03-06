package io.github.tetherlessworld.twxplore.lib.tree.models.domain

import java.util.Date

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{PropertyGetters, PropertySetters}
import io.github.tetherlessworld.twxplore.lib.tree.models.domain.vocabulary.TREE

trait TreeProperties extends PropertyGetters with PropertySetters {
  final def bbl = getPropertyObjectLong(TREE.bbl)

  final def bin = getPropertyObjectInt(TREE.bin)

  final def block = getPropertyObjectResourceIdentifier(TREE.block)

  final def blockUri = getPropertyObjectUri(TREE.block)

  final def blocksUri = getPropertyObjectUris(TREE.block)

  final def borough = getPropertyObjectResourceLabel(TREE.borough)

  final def boroughCount = getPropertyObjectInt(TREE.boroughCount)

  final def boroughUri = getPropertyObjectUri(TREE.borough)

  final def boroughs = getPropertyObjectStrings(TREE.borough)

  final def boroughsUri = getPropertyObjectUris(TREE.borough)
  final def censusTract = getPropertyObjectResourceIdentifier(TREE.censusTract)
  final def cncldist = getPropertyObjectInt(TREE.cncldist)
  final def common = getPropertyObjectString(TREE.common)
  final def community = getPropertyObjectInt(TREE.community)
  final def createdAt = getPropertyObjectDate(TREE.createdAt)
  final def curbLoc = getPropertyObjectString(TREE.curbLoc)
  final def dbh = getPropertyObjectInt(TREE.dbh)
  final def guards = getPropertyObjectString(TREE.guards)
  final def health = getPropertyObjectString(TREE.health)
  final def latin = getPropertyObjectString(TREE.latin)
  final def nta = getPropertyObjectResourceLabel(TREE.NTA)
  final def ntaUri = getPropertyObjectUri(TREE.NTA)
  final def ntaUris = getPropertyObjectUris(TREE.NTA)
  final def problem = getPropertyObjectString(TREE.problems)
  final def problems = getPropertyObjectStrings(TREE.problems)
  final def sidewalk = getPropertyObjectString(TREE.sidewalk)
  final def species = getPropertyObjectString(TREE.species)
  final def stateAssembly = getPropertyObjectInt(TREE.stateAssembly)
  final def stateSenate = getPropertyObjectInt(TREE.stateSenate)
  final def status = getPropertyObjectString(TREE.status)
  final def steward = getPropertyObjectString(TREE.steward)
  final def stump = getPropertyObjectInt(TREE.stump)
  final def userType = getPropertyObjectString(TREE.userType)
  final def x_sp = getPropertyObjectFloat(TREE.x_sp)
  final def y_sp = getPropertyObjectFloat(TREE.y_sp)
  final def zipCity = getPropertyObjectResourceLabel(TREE.zipCity)
  final def zipCityUri = getPropertyObjectUri(TREE.zipCity)
  final def censusTractUri = getPropertyObjectUri(TREE.censusTract)
  final def speciesUri = getPropertyObjectUri(TREE.species)

  //Setters
  final def bbl_=(value: Long) = addPropertyLiteral(TREE.bbl, value)
  final def bin_=(value: Int) = addPropertyLiteral(TREE.bin, value)
  final def blockUri_=(uri: Uri) = this.blocksUri = List(uri)
  final def blocksUri_=(uris: List[Uri]) = addPropertyUris(TREE.block, uris)
  final def boroughCount_=(value: Int) = addPropertyLiteral(TREE.boroughCount, value)
  final def boroughUri_=(uri: Uri) = addPropertyUri(TREE.borough, uri)
  final def boroughsUri_=(uris: List[Uri]) = addPropertyUris(TREE.borough, uris)
  final def cncldist_=(value: Int) = addPropertyLiteral(TREE.cncldist, value)
  final def common_=(value: String) = addPropertyLiteral(TREE.common, value)
  final def community_=(value: Int) = addPropertyLiteral(TREE.community, value)
  final def createdAt_=(value: Date) = addPropertyLiteral(TREE.createdAt, value)
  final def curbLoc_=(value: String) = addPropertyLiteral(TREE.curbLoc, value)
  final def dbh_=(value: Int) = addPropertyLiteral(TREE.dbh, value)
  final def guards_=(value: String) = addPropertyLiteral(TREE.guards, value)
  final def health_=(value: String) = addPropertyLiteral(TREE.health, value)
  final def latin_=(value: String) = addPropertyLiteral(TREE.latin, value)
  final def ntaUri_=(uri: Uri) = this.ntaUris = List(uri)
  final def ntaUris_=(uris: List[Uri]) = addPropertyUris(TREE.NTA, uris)
  final def problems_=(values: List[String]) =  addPropertyLiterals(TREE.problems, values)
  final def sidewalk_=(value: String) = addPropertyLiteral(TREE.sidewalk, value)
  final def stateAssembly_=(value: Int) = addPropertyLiteral(TREE.stateAssembly, value)
  final def stateSenate_=(value: Int) = addPropertyLiteral(TREE.stateSenate, value)
  final def status_=(value: String) = addPropertyLiteral(TREE.status, value)
  final def steward_=(value: String) = addPropertyLiteral(TREE.steward, value)
  final def stump_=(value: Int) = addPropertyLiteral(TREE.stump, value)
  final def userType_=(value: String) = addPropertyLiteral(TREE.userType, value)
  final def x_sp_=(value: Float) = addPropertyLiteral(TREE.x_sp, value)
  final def y_sp_=(value: Float) = addPropertyLiteral(TREE.y_sp, value)
  final def zipCityUri_= (uri: Uri) = addPropertyUri(TREE.zipCity, uri)
  final def censusTractUri_=(uri: Uri) = addPropertyUri(TREE.censusTract, uri)
  final def speciesUri_=(uri: Uri) = addPropertyUri(TREE.species, uri)

}
