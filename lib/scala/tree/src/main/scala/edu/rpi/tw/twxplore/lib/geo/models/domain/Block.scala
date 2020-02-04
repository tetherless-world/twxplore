package edu.rpi.tw.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import edu.rpi.tw.twxplore.lib.base.models.domain._
import io.github.tetherlessworld.scena.{RdfReader, RdfWriter}
import org.apache.jena.rdf.model.{Model, Resource, ResourceFactory}

final case class Block(id: Int, nta: Uri){
  val uri = Uri.parse("urn:treedata:block:" + id)
}

object Block {
  implicit class BlockResource(val resource: Resource)
    extends RdfProperties with RdfsProperties with SioProperties with TreeTermsProperties with SchemaProperties with DCTermsProperties

  implicit object BlockRdfReader extends RdfReader[Block] {
    override def read(resource: Resource): Block = {
      Block(
        id = resource.identifier.get.toInt,
        nta  = resource.NTAUri.get
      )
    }
  }

  implicit object BlockRdfWriter extends RdfWriter[Block] {
    override def write(model: Model, value: Block): Resource = {
      val resource = model.getResource(value.uri.toString) match {
        case null => ResourceFactory.createResource(value.uri.toString)
        case resource => resource
      }
      resource.identifier = value.id.toString
      resource.NTAUri = value.nta

      resource
    }
  }
}