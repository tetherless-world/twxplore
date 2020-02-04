package edu.rpi.tw.twxplore.lib.geo.models.domain

import edu.rpi.tw.twxplore.lib.base.models.domain._
import io.github.tetherlessworld.scena.{RdfReader, RdfWriter}
import org.apache.jena.rdf.model.{Model, Resource, ResourceFactory}

final case class TreeSpecies(common: String, latin: String) {
  val uri = "urn:treedata:species:" + common
}

object TreeSpecies {
  implicit class TreeSpeciesResource(val resource: Resource)
    extends RdfProperties with RdfsProperties with SioProperties with TreeTermsProperties with SchemaProperties with DCTermsProperties

  implicit object TreeSpeciesRdfReader extends RdfReader[TreeSpecies] {
    override def read(resource: Resource): TreeSpecies = {
      TreeSpecies(
        common = resource.common.get,
        latin = resource.latin.get
      )
    }
  }
  implicit object TreeSpeciesRdfWriter extends RdfWriter[State] {
    override def write(model: Model, value: TreeSpecies): Resource = {
      val resource = model.getResource(value.uri.toString) match {
        case null => ResourceFactory.createResource(value.uri.toString)
        case resource => resource
      }
      resource.common = value.common
      resource.latin = value.latin

      resource
    }
  }
}

