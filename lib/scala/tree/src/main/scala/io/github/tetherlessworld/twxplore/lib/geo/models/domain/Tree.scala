package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import java.util.Date

import io.github.tetherlessworld.scena.{Rdf, RdfReader}
import io.github.tetherlessworld.twxplore.lib.base.models.domain._
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.TREE
import org.apache.jena.rdf.model.Resource

final case class Tree(id: Int,
                      createdAt: Date,
                      dbh: Int,
                      stump: Int,
                      block: Block,
                      curbLoc: CurbLoc,
                      status: Status,
                      health: Option[Health],
                      species: Option[TreeSpecies],
                      steward: Option[Steward],
                      guards: Option[Guards],
                      sidewalk: Option[Sidewalk],
                      userType: UserType,
                      problems: List[Problems],
                      address: String,
                      postcode: Postcode,
                      zipCity: ZipCity,
                      community: Int,
                      borough: Borough,
                      cncldist: Int,
                      stateAssembly: Int,
                      stateSenate: Int,
                      NTA: NTA,
                      boroughCount: Int,
                      state: State,
                      latitude: Float,
                      longitude: Float,
                      x_sp: Float,
                      y_sp: Float,
                      censusTract: Option[CensusTract],
                      bin: Option[Int],
                      bbl: Option[Long]
                     ){
  val uri = "urn:treedata:tree:" + id
}

object Tree {
  implicit class TreeResource(val resource: Resource)
    extends RdfProperties with RdfsProperties with SioProperties with TreeTermsProperties with SchemaProperties with DCTermsProperties

  implicit object TreeRdfReader extends RdfReader[Tree] {
    override def read(resource: Resource): Tree = {
      Tree(
        id = resource.identifier.get.toInt,
        createdAt = resource.createdAt.get,
        dbh = resource.dbh.get,
        stump = resource.stump.get,
        block = Rdf.read[Block](resource.getPropertyResourceValue(TREE.block)),
        curbLoc = resource.curbLoc match {
          case Some("OffsetFromCurb") => OffsetFromCurb
          case Some("OnCurb") => OnCurb
        },
        status = resource.status match {
          case Some("Alive") => Alive
          case Some("Dead") => Dead
          case Some("Stump") => Stump
          case _ => Dead
        },
        health = resource.health match {
          case Some("Fair") => Some(Fair)
          case Some("Good") => Some(Good)
          case Some("Poor") => Some(Poor)
          case _ => None
        },
        species = Some(Rdf.read[TreeSpecies](resource.getPropertyResourceValue(TREE.species))),
        steward = resource.steward match {
          case Some("OneOrTwo") => Some(OneOrTwo)
          case Some("ThreeOrFour") => Some(ThreeOrFour)
          case _ => None
        },
        guards = resource.guards match {
          case Some("Helpful") => Some(Helpful)
          case Some("Harmful") => Some(Harmful)
          case Some("Unsure") => Some(Unsure)
          case _ => None
        },
        sidewalk = resource.sidewalk match {
          case Some("NoDamage") => Some(NoDamage)
          case Some("Damage") => Some(Damage)
          case _ => None
        },
        userType = resource.userType match {
          case Some("TreesCountStaff") => TreesCountStaff
          case Some("NYCParksStaff") => NYCParksStaff
          case Some("Volunteer") => Volunteer
        },
        problems = resource.problems.map(problem => problem match {
          case "BranchLights" => BranchLights
          case "BranchOther" => BranchOther
          case "BranchShoe" => BranchShoe
          case "MetalGrates" => MetalGrates
          case "Stones" => Stones
          case "TrunkLights" => TrunkLights
          case "TrunkOther" => TrunkOther
          case "TrunkWire" => TrunkWire
          case "RootGrate" => RootGrate
          case "RootLights" => RootLights
          case "RootStone" => RootStone
          case "Sneakers" => Sneakers
          case "WiresRope" => WiresRope
        }),
        address = resource.address.get,
        postcode = Rdf.read[Postcode](resource.getPropertyResourceValue(TREE.postcode)),
        zipCity = Rdf.read[ZipCity](resource.getPropertyResourceValue(TREE.zipCity)),
        community = resource.community.get,
        borough = Rdf.read[Borough](resource.getPropertyResourceValue(TREE.borough)),
        cncldist = resource.cncldist.get,
        stateAssembly = resource.stateAssembly.get,
        stateSenate = resource.stateSenate.get,
        NTA = Rdf.read[NTA](resource.getPropertyResourceValue(TREE.NTA)),
        boroughCount = resource.boroughCount.get,
        state = Rdf.read[State](resource.getPropertyResourceValue(TREE.state)),
        latitude = resource.latitude.get,
        longitude = resource.longitude.get,
        x_sp = resource.x_sp.get,
        y_sp = resource.y_sp.get,
        censusTract = Some(Rdf.read[CensusTract](resource.getPropertyResourceValue(TREE.censusTract))),
        bin = resource.bin,
        bbl = Some(resource.bbl.get.toLong)
      )
    }
  }
}