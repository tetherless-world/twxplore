package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import java.util.Date

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

//object Tree {
//  implicit class TreeResource(val resource: Resource)
//    extends RdfProperties with RdfsProperties with SioProperties with TreeTermsProperties with SchemaProperties with DCTermsProperties
//
//  implicit object TreeRdfReader extends RdfReader[Tree] {
//    override def read(resource: Resource): Tree = {
//      Tree(
//        id = resource.identifier.get.toInt,
//        createdAt = resource.c
//      )
//    }
//  }
//}

