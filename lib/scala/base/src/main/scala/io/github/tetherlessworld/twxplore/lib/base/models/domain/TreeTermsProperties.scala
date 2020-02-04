package io.github.tetherlessworld.twxplore.lib.base.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.TREE

trait TreeTermsProperties extends PropertyGetters with PropertySetters {
  //final def createdAt =
  final def dbh = getPropertyObjectInt(TREE.dbh)

  final def stump = getPropertyObjectInt(TREE.stump)

  final def block = getPropertyObjectString(TREE.block)
  final def blockUri = getPropertyObjectUri(TREE.block)
  final def blocksUri = getPropertyObjectUris(TREE.block)

  final def curbLoc = getPropertyObjectString(TREE.curbLoc)

  final def status = getPropertyObjectString(TREE.status)
  final def health = getPropertyObjectString(TREE.health)
  final def species = getPropertyObjectString(TREE.species)
  final def steward = getPropertyObjectString(TREE.steward)
  final def guards = getPropertyObjectString(TREE.guards)
  final def sidewalk = getPropertyObjectString(TREE.sidewalk)
  final def userType = getPropertyObjectString(TREE.userType)
  final def problems = getPropertyObjectStrings(TREE.problems)
  final def problem = getPropertyObjectString(TREE.problems)
  final def common = getPropertyObjectString(TREE.common)
  final def latin = getPropertyObjectString(TREE.latin)

  final def zipCity = getPropertyObjectString(TREE.zipCity)
  final def community = getPropertyObjectInt(TREE.community)

  final def borough = getPropertyObjectString(TREE.borough)
  final def boroughs = getPropertyObjectStrings(TREE.borough)
  final def boroughUri = getPropertyObjectUri(TREE.borough)
  final def boroughsUri = getPropertyObjectUris(TREE.borough)

  final def cncldist = getPropertyObjectInt(TREE.cncldist)
  final def stateAssembly = getPropertyObjectInt(TREE.stateAssembly)
  final def stateSenate = getPropertyObjectInt(TREE.stateSenate)
  final def NTA = getPropertyObjectString(TREE.NTA)

  final def NTAUri = getPropertyObjectUri(TREE.NTA)
  final def NTAUris = getPropertyObjectUris(TREE.NTA)

  final def boroughCount = getPropertyObjectInt(TREE.boroughCount)
  final def x_sp = getPropertyObjectFloat(TREE.x_sp)
  final def y_sp = getPropertyObjectFloat(TREE.y_sp)
  final def censusTract = getPropertyObjectString(TREE.censusTract)
  final def bin = getPropertyObjectInt(TREE.bin)

  //Setters
  final def boroughsUri_=(uris: List[Uri]) = addPropertyUris(TREE.borough, uris)
  final def blocksUri_=(uris: List[Uri]) = addPropertyUris(TREE.block, uris)
  final def blockUri_=(uri: Uri) = this.blocksUri = List(uri)
  final def NTAUris_=(uris: List[Uri]) = addPropertyUris(TREE.NTA, uris)
  final def NTAUri_=(uri: Uri) = this.NTAUris = List(uri)
  final def common_=(value: String) = addPropertyLiteral(TREE.common, value)
  final def latin_=(value: String) = addPropertyLiteral(TREE.latin, value)

}
