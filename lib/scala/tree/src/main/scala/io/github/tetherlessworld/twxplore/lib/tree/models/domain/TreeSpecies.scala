package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import io.github.tetherlessworld.scena.{RdfReader, RdfWriter}
import io.github.tetherlessworld.twxplore.lib.base.models.domain._
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.TREE
import org.apache.jena.rdf.model.{Model, Resource, ResourceFactory}

final case class TreeSpecies(common: String, latin: String) {
  val uri = TREE.SPECIES_URI_PREFIX + common.replace(" ", "_")
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

  implicit object TreeSpeciesRdfWriter extends RdfWriter[TreeSpecies] {
    override def write(model: Model, value: TreeSpecies): Resource = {
      val resource = Option(model.getResource(value.uri.toString))
        .getOrElse(ResourceFactory.createResource(value.uri.toString))
      resource.common = value.common
      resource.latin = value.latin

      resource
    }
  }
}

