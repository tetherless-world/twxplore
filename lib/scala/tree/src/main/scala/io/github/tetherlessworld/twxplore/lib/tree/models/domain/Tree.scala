package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import java.util.Date

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{RdfReader, RdfWriter}
import io.github.tetherlessworld.twxplore.lib.base.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.models.domain.TreeProperties
import io.github.tetherlessworld.twxplore.lib.tree.models.domain.vocabulary.TREE
import org.apache.jena.rdf.model.{Model, Resource, ResourceFactory}

final case class Tree(id: Int,
                      createdAt: Date,
                      dbh: Int,
                      stump: Int,
                      block: Uri,
                      curbLoc: CurbLoc,
                      status: Status,
                      health: Option[Health],
                      species: Option[Uri],
                      steward: Option[Steward],
                      guards: Option[Guards],
                      sidewalk: Option[Sidewalk],
                      userType: UserType,
                      problems: List[Problems],
                      address: String,
                      postcode: Uri,
                      city: Uri,
                      zipCity: Uri,
                      community: Int,
                      borough: Uri,
                      cncldist: Int,
                      stateAssembly: Int,
                      stateSenate: Int,
                      NTA: Uri,
                      boroughCount: Int,
                      state: Uri,
                      latitude: Float,
                      longitude: Float,
                      x_sp: Float,
                      y_sp: Float,
                      censusTract: Option[Uri],
                      bin: Option[Int],
                      bbl: Option[Long],
                      uri: Uri
                     )

object Tree {

  implicit class TreeResource(val resource: Resource)
    extends RdfProperties with RdfsProperties with SioProperties with TreeProperties with SchemaProperties with DcTermsProperties

  implicit object TreeRdfReader extends RdfReader[Tree] {
    override def read(resource: Resource): Tree = {
      Tree(
        id = resource.identifier.get.toInt,
        createdAt = resource.createdAt.get,
        dbh = resource.dbh.get,
        stump = resource.stump.get,
        //block = Rdf.read[Block](resource.getPropertyResourceValue(TREE.block)),
        block = resource.blockUri.get,
        curbLoc = resource.curbLoc match {
          case Some("OffsetFromCurb") => CurbLoc.OffsetFromCurb
          case Some("OnCurb") => CurbLoc.OnCurb
        },
        status = resource.status match {
          case Some("Alive") => Status.Alive
          case Some("Dead") => Status.Dead
          case Some("Stump") => Status.Stump
          case _ => Status.Dead
        },
        health = resource.health map ({
          case "Fair" => Health.Fair
          case "Good" => Health.Good
          case "Poor" => Health.Poor
        }),
        //        species = Some(Rdf.read[TreeSpecies](resource.getPropertyResourceValue(TREE.species))),
        species = resource.speciesUri,
        steward = resource.steward map ({
          case "OneOrTwo" => Steward.OneOrTwo
          case "ThreeOrFour" => Steward.ThreeOrFour
        }),
        guards = resource.guards map ({
          case "Helpful" => Guards.Helpful
          case "Harmful" => Guards.Harmful
          case "Unsure" => Guards.Unsure
        }),
        sidewalk = resource.sidewalk map ({
          case "NoDamage" => Sidewalk.NoDamage
          case "Damage" => Sidewalk.Damage
        }),
        userType = resource.userType match {
          case Some("TreesCountStaff") => UserType.TreesCountStaff
          case Some("NYCParksStaff") => UserType.NYCParksStaff
          case Some("Volunteer") => UserType.Volunteer
        },
        problems = resource.problems.map {
          case "BranchLights" => Problems.BranchLights
          case "BranchOther" => Problems.BranchOther
          case "BranchShoe" => Problems.BranchShoe
          case "MetalGrates" => Problems.MetalGrates
          case "Stones" => Problems.Stones
          case "TrunkLights" => Problems.TrunkLights
          case "TrunkOther" => Problems.TrunkOther
          case "TrunkWire" => Problems.TrunkWire
          case "RootGrate" => Problems.RootGrate
          case "RootOther" => Problems.RootOther
          case "RootLights" => Problems.RootLights
          case "RootStone" => Problems.RootStone
          case "Sneakers" => Problems.Sneakers
          case "WiresRope" => Problems.WiresRope
        },
        address = resource.address.get,
        //postcode = Rdf.read[Postcode](resource.getPropertyResourceValue(Schema.postalCode)),
        postcode = resource.postalCodeUri.get,
        //       city = Rdf.read[City](resource.getPropertyResourceValue(Schema.city)),
        city = resource.cityUri.get,
        //        zipCity = Rdf.read[ZipCity](resource.getPropertyResourceValue(TREE.zipCity)),
        zipCity = resource.zipCityUri.get,
        community = resource.community.get,
        //        borough = Rdf.read[Borough](resource.getPropertyResourceValue(TREE.borough)),
        borough = resource.boroughUri.get,
        cncldist = resource.cncldist.get,
        stateAssembly = resource.stateAssembly.get,
        stateSenate = resource.stateSenate.get,
        //        NTA = Rdf.read[Nta](resource.getPropertyResourceValue(TREE.NTA)),
        NTA = resource.ntaUri.get,
        boroughCount = resource.boroughCount.get,
        //        state = Rdf.read[State](resource.getPropertyResourceValue(Schema.state)),
        state = resource.stateUri.get,
        latitude = resource.latitude.get,
        longitude = resource.longitude.get,
        x_sp = resource.x_sp.get,
        y_sp = resource.y_sp.get,
        //        censusTract = Some(Rdf.read[CensusTract](resource.getPropertyResourceValue(TREE.censusTract))),
        censusTract = resource.censusTractUri,
        bin = resource.bin,
        bbl = resource.bbl,
        uri = Uri.parse(resource.getURI)
      )
    }
  }

  implicit object TreeRdfWriter extends RdfWriter[Tree] {
    override def write(model: Model, value: Tree): Resource = {
      val resource = Option(model.getResource(value.uri.toString))
        .getOrElse(ResourceFactory.createResource(value.uri.toString))

      resource.identifier = value.id.toString
      resource.createdAt = value.createdAt
      resource.dbh = value.dbh

      resource.stump = value.stump

      resource.blockUri = value.block

      resource.curbLoc = value.curbLoc.toString
      resource.status = value.status.toString
      if (value.status == Status.Alive) {
        if (value.health.isDefined) resource.health = value.health.get.toString
        if (value.species.isDefined) {
          resource.speciesUri = value.species.get
        }
        if (value.guards.isDefined) resource.guards = value.guards.get.toString
        if (value.sidewalk.isDefined) resource.sidewalk = value.sidewalk.get.toString
      }
      resource.userType = value.userType.toString
      resource.problems = value.problems.map(problem => problem.toString)
      resource.address = value.address
      resource.postalCodeUri = value.postcode
      resource.zipCityUri = value.zipCity
      resource.cityUri = value.city
      resource.community = value.community
      resource.boroughUri = value.borough
      resource.cncldist = value.cncldist
      resource.stateAssembly = value.stateAssembly
      resource.stateSenate = value.stateSenate
      resource.ntaUri = value.NTA
      resource.boroughCount = value.boroughCount
      resource.stateUri = value.state
      resource.latitude = value.latitude
      resource.longitude = value.longitude
      resource.x_sp = value.x_sp
      resource.y_sp = value.y_sp
      if (value.censusTract.isDefined) {
        resource.censusTractUri = value.censusTract.get
      }
      if (value.bin.isDefined) resource.bin = value.bin.get
      if (value.bbl.isDefined) resource bbl = value.bbl.get
      resource.`type` = ResourceFactory.createResource(TREE.TREE_URI_PREFIX)
      resource
    }
  }

}
