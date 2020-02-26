package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{RdfReader, RdfWriter}
import io.github.tetherlessworld.twxplore.lib.base.models.domain._
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.TREE
import io.github.tetherlessworld.twxplore.lib.tree.models.domain.SelectionArea
import org.apache.jena.rdf.model.{Model, Resource, ResourceFactory}

final case class Block(id: Int, name: String, nta: Uri, feature: Uri, uri: Uri) extends Ordered[Block] with SelectionArea{
  def compare(that: Block) = this.id compare that.id
}

object Block {
  implicit class BlockResource(val resource: Resource)
    extends RdfProperties with RdfsProperties with SioProperties with TreeTermsProperties with SchemaProperties with DCTermsProperties with GeoProperties

  implicit object BlockRdfReader extends RdfReader[Block] {
    override def read(resource: Resource): Block = {
      Block(
        id = resource.identifier.get.toInt,
        name = resource.identifier.get,
        nta  = resource.ntaUri.get,
        feature = resource.spatialDimensionProp.get,
        uri = Uri.parse(resource.getURI)
      )
    }
  }

  implicit object BlockRdfWriter extends RdfWriter[Block] {
    override def write(model: Model, value: Block): Resource = {
      val resource = Option(model.getResource(value.uri.toString))
        .getOrElse(ResourceFactory.createResource(value.uri.toString))
      resource.identifier = value.id.toString
      resource.ntaUri = value.nta
      resource.spatialDimensionProp = value.feature
      resource.`type` = ResourceFactory.createResource(TREE.BLOCK_URI_PREFIX)

      resource
    }
  }
}
