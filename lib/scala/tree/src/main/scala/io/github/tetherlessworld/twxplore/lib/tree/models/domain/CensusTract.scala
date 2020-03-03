package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{RdfReader, RdfWriter}
import io.github.tetherlessworld.twxplore.lib.base.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.models.domain.TreeProperties
import io.github.tetherlessworld.twxplore.lib.tree.models.domain.vocabulary.TREE
import org.apache.jena.rdf.model.{Model, Resource, ResourceFactory}

final case class CensusTract(id: Int, shapefile: String, uri: Uri)

object CensusTract {

  implicit class CensusTractResource(val resource: Resource)
    extends RdfProperties with RdfsProperties with SioProperties with TreeProperties with SchemaProperties with DcTermsProperties

  implicit object CensusTractRdfReader extends RdfReader[CensusTract] {
    override def read(resource: Resource): CensusTract = {
      CensusTract(
        id = resource.identifier.get.toInt,
        shapefile = "a dud",
        uri = Uri.parse(resource.getURI)
      )
    }
  }

  implicit object CensusTractRdfWriter extends RdfWriter[CensusTract] {
    override def write(model: Model, value: CensusTract): Resource = {
      val resource = Option(model.getResource(value.uri.toString))
        .getOrElse(ResourceFactory.createResource(value.uri.toString))
      resource.identifier = value.id.toString
      resource.polygon = value.shapefile
      resource.`type` = ResourceFactory.createResource(TREE.CENSUSTRACT_URI_PREFIX)
      resource
    }
  }

}
