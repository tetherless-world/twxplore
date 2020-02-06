package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import java.util.Date

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{Rdf, RdfReader, RdfWriter}
import io.github.tetherlessworld.twxplore.lib.base.models.domain._
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.TREE
import org.apache.jena.rdf.model.{Model, Resource, ResourceFactory}

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
  val uri = Uri.parse("urn:treedata:resource:tree:" + id)
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

  implicit object TreeRdfWriter extends RdfWriter[Tree] {
    override def write(model: Model, value: Tree): Resource = {
      val resource = Option(model.getResource(value.uri.toString))
        .getOrElse(ResourceFactory.createResource(value.uri.toString))

      resource.identifier = value.id.toString
      resource.createdAt = value.createdAt
      resource.dbh = value.dbh

      resource.stump = value.stump

      val block = Rdf.write[Block](model, value.block)
      resource.addProperty(TREE.block, block)

      resource.curbLoc = value.curbLoc.label
      resource.status = value.status.label
      if (value.status.label == "Alive") {
        //println(value.status.label, value.id)
        if(value.health != None) resource.health = value.health.get.label
        if(value.species != None) {
          val species = Rdf.write[TreeSpecies](model, value.species.get)
          resource.addProperty(TREE.species, species)
        }
        if(value.guards != None) resource.guards = value.guards.get.label
        if(value.sidewalk != None)  resource.sidewalk = value.sidewalk.get.label
      }
      resource.userType = value.userType.label
      resource.problems = value.problems.map(problem => problem.label)
      resource.address = value.address
      val postcode = Rdf.write[Postcode](model, value.postcode)
      resource.addProperty(TREE.postcode, postcode)
      val zipCity = Rdf.write[ZipCity](model, value.zipCity)
      resource.addProperty(TREE.zipCity, zipCity)
      resource.community = value.community
      val borough = Rdf.write[Borough](model, value.borough)
      resource.addProperty(TREE.borough, borough)
      resource.cncldist = value.cncldist
      resource.stateAssembly = value.stateAssembly
      resource.stateSenate = value.stateSenate
      val NTA = Rdf.write[NTA](model, value.NTA)
      resource.addProperty(TREE.NTA, NTA)
      resource.boroughCount = value.boroughCount
      val state = Rdf.write[State](model, value.state)
      resource.addProperty(TREE.state, state)
      resource.latitude = value.latitude
      resource.longitude = value.longitude
      resource.x_sp = value.x_sp
      resource.y_sp = value.y_sp
      if (value.censusTract != None) {
        val censusTract = Rdf.write[CensusTract](model, value.censusTract.get)
        resource.addProperty(TREE.censusTract, censusTract)
      }
      if(value.bin != None) resource.bin = value.bin.get
      if(value.bbl != None) resource bbl = value.bbl.get
      resource
    }
  }
}