package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena._
import io.github.tetherlessworld.twxplore.lib.base.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.models.domain.TreeProperties
import io.github.tetherlessworld.twxplore.lib.tree.models.domain.vocabulary.TREE
import org.apache.jena.rdf.model.{Model, Resource, ResourceFactory}

final case class ZipCity(city: String, uri: Uri)

object ZipCity {

  implicit class ZipCityResource(val resource: Resource)
    extends RdfProperties with RdfsProperties with SioProperties with TreeProperties with SchemaProperties with DcTermsProperties

  implicit object ZipCityRdfReader extends RdfReader[ZipCity] {
    override def read(resource: Resource): ZipCity = {
      ZipCity(
        city = resource.label.get,
        uri = Uri.parse(resource.getURI)
      )
    }
  }

  implicit object ZipCityRdfWriter extends RdfWriter[ZipCity] {
    override def write(model: Model, value: ZipCity): Resource = {
      val resource = Option(model.getResource(value.uri.toString))
        .getOrElse(ResourceFactory.createResource(value.uri.toString))
      resource.label = value.city
      resource.`type` = ResourceFactory.createResource(TREE.ZIPCITY_URI_PREFIX)
      resource
    }
  }

}
