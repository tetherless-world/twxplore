package edu.rpi.tw.twxplore.lib.geo.models.domain

import java.util.Date

import com.google.api.client.util.DateTime
import edu.rpi.tw.twks.uri.Uri
import edu.rpi.tw.twxplore.lib.base.utils.rdf.{Rdf, RdfReader, RdfWriter}
import org.apache.jena.geosparql.implementation.vocabulary.Geo
import org.apache.jena.rdf.model.{Resource, ResourceFactory}
import org.apache.jena.vocabulary.{RDF, RDFS}

import scala.collection.mutable.ListBuffer

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
                      problems: ListBuffer[Option[Problems]],
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
                      x_sp: Float,
                      y_sp: Float,
                      censusTract: Option[CensusTract],
                      bin: Option[Int],
                      bbl: Option[Long]
                     )

