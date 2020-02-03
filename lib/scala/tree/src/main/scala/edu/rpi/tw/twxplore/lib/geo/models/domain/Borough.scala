package edu.rpi.tw.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import edu.rpi.tw.twxplore.lib.base.models.domain.vocabulary.{SIO, TREE}
import io.github.tetherlessworld.scena.{RdfReader, RdfWriter}
import org.apache.jena.rdf.model.{Resource, ResourceFactory}
import org.apache.jena.vocabulary.{DCTerms, RDFS}

final case class Borough(borough: String, borocode: Int, ntaList: List[String]){
  val uri = Uri.parse("urn:treedata:borough:" + borocode)
  def addNTA(nta: NTA): Borough = {
    Borough(borough, borocode, ntaList :+ nta.nta)
  }
}

object Borough {
  implicit object BoroughRdfReader extends RdfReader[Borough] {
    override def read(resource: Resource): Borough = {
      val ntaResources = resource.listProperties(SIO.isLocationOf)
      val ntaList = List[String]()
      while(ntaResources.hasNext){
        ntaList :+ ntaResources.next().getResource.getProperty(DCTerms.identifier).getObject.asLiteral().toString
      }
      Borough(
        borough = resource.getProperty(RDFS.label).getObject.asLiteral().getString,
        borocode = resource.getProperty(DCTerms.identifier).getObject().asLiteral().getInt,
        ntaList = ntaList
      )
    }
  }

  implicit object BoroughRdfWriter extends RdfWriter[Borough] {
    override def write(value: Borough): Resource = {
      val resource = ResourceFactory.createResource(TREE.URI + "borough")
      resource.addProperty(RDFS.label, value.borough)
      resource.addProperty(DCTerms.identifier, value.borocode.toString)
      for( nta <- value.ntaList) {
        resource.addProperty(SIO.isLocationOf, ResourceFactory.createResource(TREE.URI + "NTA")).addProperty(DCTerms.identifier, nta)
      }
      resource
    }
  }
}


