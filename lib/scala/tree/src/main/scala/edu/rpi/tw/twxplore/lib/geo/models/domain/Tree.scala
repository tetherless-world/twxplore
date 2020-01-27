package edu.rpi.tw.twxplore.lib.geo.models.domain

import com.google.api.client.util.DateTime
import edu.rpi.tw.twks.uri.Uri
import edu.rpi.tw.twxplore.lib.base.utils.rdf.{Rdf, RdfReader, RdfWriter}
import org.apache.jena.geosparql.implementation.vocabulary.Geo
import org.apache.jena.rdf.model.{Resource, ResourceFactory}
import org.apache.jena.vocabulary.{RDF, RDFS}

final case class Tree(id: Int,
                      createdAt: DateTime,
                      dbh: Int,
                      stump: Int,
                      block: Block,
                      curbLoc: CurbLoc,
                      status: Status,
                      health: Health,
                      species: TreeSpecies,
                      steward: Steward,
                      guards: Guards,
                      sidewalk: Sidewalk,
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
                      Longitude: Float,
                      x_sp: Int,
                      y_sp: Int,
                      councilDistrict: Int,
                      censusTract: CensusTract,
                      bin: Int,
                      bbl: Int
                     )

