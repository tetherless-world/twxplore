package edu.rpi.tw.twxplore.lib.geo.models.domain

import org.scala_tools.time.Imports._
import edu.rpi.tw.twks.uri.Uri
import edu.rpi.tw.twxplore.lib.base.utils.rdf.{Rdf, RdfReader, RdfWriter}
import org.apache.jena.geosparql.implementation.vocabulary.Geo
import org.apache.jena.rdf.model.{Resource, ResourceFactory}
import org.apache.jena.vocabulary.{RDF, RDFS}

sealed trait CurbLoc
case object OffsetFromCurb extends CurbLoc
case object OnCurb extends CurbLoc

sealed trait Status
case object Alive extends Status
case object Dead extends Status
case object Stump extends Status

sealed trait Health
case object Fair extends Health
case object Good extends Health
case object Poor extends Health

sealed trait Steward
case object None extends Steward
case object 1or2 extends Steward
case object 3or4 extends Steward

sealed trait Guards
case object None extends Guards
case object Helpful extends Guards
case object Harmful extends Guards

sealed trait Sidewalk
case object NoDamage extends Sidewalk
case object Damage extends Sidewalk

sealed trait UserType
case object TreesCountStaff extends UserType
case object NYCParksStaff extends UserType
case object Volunteer extends UserType

sealed trait Problems
case object BranchLights extends Problems
case object BranchOther extends Problems
case object BranchShoe extends Problems
case object MetalGrates extends Problems
case object None extends Problems
case object Stones extends Problems
case object TrunkLights extends Problems
case object TrunkOther extends Problems
case object TrunkWire extends Problems
case object RootGrate extends Problems
case object RootLights extends Problems
case object RootOther extends Problems
case object RootStone extends Problems
case object WiresRope extends Problems

final case class Tree(id: Int, createdAt: DateTime, dbh: Int, stump: Int, block: Block,
                      curbLoc: CurbLoc, status: status, health: Health, treeSpecies: TreeSpecies,
                      steward: Steward, guards: guards, sidewalk: sidewalk, userType: UserType,
                      problems: List[Problems], address: String, postcode: Postcode, zipCity: ZipCity,
                      community: Int, borough: Borough, cncldist: Int, stateAssembly: Int,
                      stateSenate: Int, NTA: NTA, boroughCount: Int, state: State, latitude: Float, Longitude: Float,
                      x_sp: Int, y_sp: Int, councilDistrict: Int, censusTract: Int, bin: Int, bbl: Int
                     )

