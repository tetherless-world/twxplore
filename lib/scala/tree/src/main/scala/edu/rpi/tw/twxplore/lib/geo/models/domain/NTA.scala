package edu.rpi.tw.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import edu.rpi.tw.twxplore.lib.base.utils.rdf.{Rdf, RdfReader, RdfWriter}
import org.apache.jena.geosparql.implementation.vocabulary.Geo
import org.apache.jena.rdf.model.{Resource, ResourceFactory}
import org.apache.jena.vocabulary.{RDF, RDFS}

import scala.collection.mutable.ListBuffer

final case class NTA(nta: String, ntaName: String, blocks: ListBuffer[Block], borough: String, postCode: Int, community: Int, councilDistrict: Int)