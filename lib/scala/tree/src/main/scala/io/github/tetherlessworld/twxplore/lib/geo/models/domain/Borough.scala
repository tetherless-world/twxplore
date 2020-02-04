package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{RdfReader, RdfWriter}
import io.github.tetherlessworld.twxplore.lib.base.models.domain._
import org.apache.jena.rdf.model.{Model, Resource, ResourceFactory}

final case class Borough(borough: String, borocode: Int, ntaList: List[Uri]) {
  val uri = Uri.parse("urn:treedata:borough:" + borocode)

  def addNTA(nta: NTA): Borough = {
    Borough(borough, borocode, ntaList :+ nta.uri)
  }
}

object Borough {
  implicit class BoroughResource(val resource: Resource)
    extends RdfProperties with RdfsProperties with SioProperties with TreeTermsProperties with SchemaProperties with DCTermsProperties

  implicit object BoroughRdfReader extends RdfReader[Borough] {
    override def read(resource: Resource): Borough = {
      Borough(
        borough = resource.label.get,
        borocode = resource.identifier.get.toInt,
        ntaList = resource.NTAUris
      )
    }
  }

  implicit object BoroughRdfWriter extends RdfWriter[Borough] {
    override def write(model: Model, value: Borough): Resource = {

      val resource = model.getResource(value.uri.toString) match {
        case null => ResourceFactory.createResource(value.uri.toString)
        case resource => resource
      }

      resource.label = value.borough
      resource.identifier = value.borocode.toString
      resource.NTAUris = value.ntaList

      resource
    }
  }
}


