package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{RdfReader, RdfWriter}
import io.github.tetherlessworld.twxplore.lib.base.models.domain._
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.TREE
import org.apache.jena.rdf.model.{Model, Resource, ResourceFactory}

final case class Borough(name: String, borocode: Int, city: Uri, ntaList: List[Uri]) {
  val uri = Uri.parse(TREE.BOROUGH_URI_PREFIX + borocode)

  def addNTA(nta: Nta): Borough = {
    this.copy(ntaList = ntaList :+ nta.uri)
  }
}

object Borough {
  implicit class BoroughResource(val resource: Resource)
    extends RdfProperties with RdfsProperties with SioProperties with TreeTermsProperties with SchemaProperties with DCTermsProperties

  implicit object BoroughRdfReader extends RdfReader[Borough] {
    override def read(resource: Resource): Borough = {
      Borough(
        name = resource.label.get,
        borocode = resource.identifier.get.toInt,
        city = resource.cityUri.get,
        ntaList = resource.ntaUris
      )
    }
  }

  implicit object BoroughRdfWriter extends RdfWriter[Borough] {
    override def write(model: Model, value: Borough): Resource = {
      val resource = Option(model.getResource(value.uri.toString))
        .getOrElse(ResourceFactory.createResource(value.uri.toString))

      resource.label = value.name
      resource.identifier = value.borocode.toString
      resource.ntaUris = value.ntaList
      resource.cityUri = value.city
      resource
    }
  }
}

