package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import java.util.Date

import io.github.tetherlessworld.scena.RdfReader
import io.github.tetherlessworld.twxplore.lib.base.models.domain._
import org.apache.jena.rdf.model.Resource

final case class Tree(id: Int,
                      createdAt: Date,
                      dbh: Int,
                      stump: Int,
                      block: Block,
                      curbLoc: CurbLoc,
                      status: Status,
                      health: Option[Health],
                      species: Option[domain.TreeSpecies],
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

object TreeSpecies {
  implicit class TreeSpeciesResource(val resource: Resource)
    extends RdfProperties with RdfsProperties with SioProperties with TreeTermsProperties with SchemaProperties with DCTermsProperties

  implicit object TreeRdfReader extends RdfReader[Tree] {
    override def read(resource: Resource): Tree = {
      TreeSpecies(
        common = resource.common.get,
        latin = resource.latin.get
      )
    }
  }
}

