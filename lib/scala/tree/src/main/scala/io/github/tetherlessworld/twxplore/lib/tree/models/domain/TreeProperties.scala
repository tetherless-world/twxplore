package io.github.tetherlessworld.twxplore.lib.tree.models.domain

import java.util.Date

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{PropertyGetters, PropertySetters}
import io.github.tetherlessworld.twxplore.lib.tree.models.domain.vocabulary.TREE

trait TreeProperties extends PropertyGetters with PropertySetters {
  final def bbl = getPropertyObjectLongs(TREE.bbl).headOption

  final def bin = getPropertyObjectInts(TREE.bin).headOption

//  final def block = getPropertyObjectResourceIdentifier(TREE.block)

  final def blockUri = blockUris.headOption

  final def blockUris = getPropertyObjectResourceUris(TREE.block).map(uri => Uri.parse(uri))

//  final def borough = getPropertyObjectResourceLabel(TREE.borough)

  final def boroughCount = getPropertyObjectInts(TREE.boroughCount).headOption

  final def boroughUri = boroughsUri.headOption

  final def boroughs = getPropertyObjectStrings(TREE.borough)

  final def boroughsUri = getPropertyObjectResourceUris(TREE.borough).map(uri => Uri.parse(uri))
//  final def censusTract = getPropertyObjectResourceIdentifier(TREE.censusTract)
  final def cncldist = getPropertyObjectInts(TREE.cncldist).headOption
  final def common = getPropertyObjectStrings(TREE.common).headOption
  final def community = getPropertyObjectInts(TREE.community).headOption
  final def createdAt = getPropertyObjectDates(TREE.createdAt).headOption
  final def curbLoc = getPropertyObjectStrings(TREE.curbLoc).headOption
  final def dbh = getPropertyObjectInts(TREE.dbh).headOption
  final def guards = getPropertyObjectStrings(TREE.guards).headOption
  final def health = getPropertyObjectStrings(TREE.health).headOption
  final def latin = getPropertyObjectStrings(TREE.latin).headOption
//  final def nta = getPropertyObjectResourceLabel(TREE.NTA)
  final def ntaUri = ntaUris.headOption
  final def ntaUris = getPropertyObjectResourceUris(TREE.NTA).map(uri => Uri.parse(uri))
  final def problem = problems.headOption
  final def problems = getPropertyObjectStrings(TREE.problems)
  final def sidewalk = getPropertyObjectStrings(TREE.sidewalk).headOption
  final def species = getPropertyObjectStrings(TREE.species).headOption
  final def stateAssembly = getPropertyObjectInts(TREE.stateAssembly).headOption
  final def stateSenate = getPropertyObjectInts(TREE.stateSenate).headOption
  final def status = getPropertyObjectStrings(TREE.status).headOption
  final def steward = getPropertyObjectStrings(TREE.steward).headOption
  final def stump = getPropertyObjectInts(TREE.stump).headOption
  final def userType = getPropertyObjectStrings(TREE.userType).headOption
  final def x_sp = getPropertyObjectFloats(TREE.x_sp).headOption
  final def y_sp = getPropertyObjectFloats(TREE.y_sp).headOption
//  final def zipCity = getPropertyObjectResourceLabel(TREE.zipCity)
  final def zipCityUri = getPropertyObjectResourceUris(TREE.zipCity).map(uri => Uri.parse(uri)).headOption
  final def censusTractUri = getPropertyObjectResourceUris(TREE.censusTract).map(uri => Uri.parse(uri)).headOption
  final def speciesUri = getPropertyObjectResourceUris(TREE.species).map(uri => Uri.parse(uri)).headOption

  //Setters
  final def bbl_=(value: Long) = addPropertyLiteral(TREE.bbl, value)
  final def bin_=(value: Int) = addPropertyLiteral(TREE.bin, value)
  final def blockUri_=(uri: Uri) = this.blockUris = List(uri)
  final def blockUris_=(uris: List[Uri]) = addPropertyUris(TREE.block, uris.map(uri => uri.toString))
  final def boroughCount_=(value: Int) = addPropertyLiteral(TREE.boroughCount, value)
  final def boroughUri_=(uri: Uri) = addPropertyUri(TREE.borough, uri.toString)
  final def boroughsUri_=(uris: List[Uri]) = addPropertyUris(TREE.borough, uris.map(uri => uri.toString))
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
  final def ntaUris_=(uris: List[Uri]) = addPropertyUris(TREE.NTA, uris.map(uri => uri.toString))
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
  final def zipCityUri_= (uri: Uri) = addPropertyUri(TREE.zipCity, uri.toString)
  final def censusTractUri_=(uri: Uri) = addPropertyUri(TREE.censusTract, uri.toString)
  final def speciesUri_=(uri: Uri) = addPropertyUri(TREE.species, uri.toString)
}
