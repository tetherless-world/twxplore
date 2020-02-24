package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{RdfReader, RdfWriter}
import io.github.tetherlessworld.twxplore.lib.base.models.domain._
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.TREE
import org.apache.jena.rdf.model.{Model, Resource, ResourceFactory}

final case class Postcode(code: Int, city: Uri, uri: Uri) {
}

object Postcode {
  implicit class PostcodeResource(val resource: Resource)
    extends RdfProperties with RdfsProperties with SioProperties with TreeTermsProperties with DCTermsProperties with SchemaProperties

  implicit object PostcodeRdfReader extends RdfReader[Postcode] {
    override def read(resource: Resource): Postcode = {
      Postcode(
        code = resource.identifier.get.toInt,
        city = resource.cityUri.get,
        uri = Uri.parse(resource.getURI)
      )
    }
  }
  implicit object PostcodeRdfWriter extends RdfWriter[Postcode] {
    override def write(model: Model, value: Postcode): Resource = {
      val resource = Option(model.getResource(value.uri.toString))
        .getOrElse(ResourceFactory.createResource(value.uri.toString))

      resource.cityUri = value.city
      resource.identifier = value.code.toString
      resource.`type` = ResourceFactory.createResource(TREE.POSTCODE_URI_PREFIX)
      resource
    }
  }
}
