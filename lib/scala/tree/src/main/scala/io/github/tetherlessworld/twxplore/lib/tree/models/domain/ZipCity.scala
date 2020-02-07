package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{RdfReader, RdfWriter}
import io.github.tetherlessworld.twxplore.lib.base.models.domain._
import org.apache.jena.rdf.model.{Model, Resource, ResourceFactory}

final case class ZipCity(city: String) {
  val uri = Uri.parse("urn:treedata:resource:zipcity:" + city.replace(" ", "_"))
}

object ZipCity {
  implicit class ZipCityResource(val resource: Resource)
    extends RdfProperties with RdfsProperties with SioProperties with TreeTermsProperties with SchemaProperties with DCTermsProperties

  implicit object ZipCityRdfReader extends RdfReader[ZipCity] {
    override def read(resource: Resource): ZipCity = {
      ZipCity(
        city = resource.label.get
      )
    }
  }
  implicit object ZipCityRdfWriter extends RdfWriter[ZipCity] {
    override def write(model: Model, value: ZipCity): Resource = {
      val resource = Option(model.getResource(value.uri.toString))
        .getOrElse(ResourceFactory.createResource(value.uri.toString))
      resource.label = value.city
      resource
    }
  }
}
