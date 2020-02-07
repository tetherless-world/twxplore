package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{RdfReader, RdfWriter}
import io.github.tetherlessworld.twxplore.lib.base.models.domain._
import org.apache.jena.rdf.model.{Model, Resource, ResourceFactory}

//Nta
final case class NTA(nta: String, name: String, blocks: List[Uri], borough: Uri, postCode: Uri) extends Ordered[NTA] {
  val uri = Uri.parse("urn:treedata:resource:nta:" + nta)

  def compare(that: NTA) = this.nta compare that.nta

  def addBlock(block: Block): NTA = {
    NTA(nta, name, blocks :+ block.uri, borough, postCode)
  }
}

object NTA {
  implicit class NTAResource(val resource: Resource)
    extends RdfProperties with RdfsProperties with SioProperties with TreeTermsProperties with SchemaProperties with DCTermsProperties


  implicit object NTARdfReader extends RdfReader[NTA] {
    override def read(resource: Resource): NTA = {
      NTA(
        nta = resource.identifier.get,
        name = resource.label.get,
        borough = resource.boroughUri.get,
        postCode = resource.postalCodeUri.get,
        blocks = resource.blocksUri,
      )
    }
  }

  implicit object NTARdfWriter extends RdfWriter[NTA] {
    override def write(model: Model, value: NTA): Resource = {
      val resource = Option(model.getResource(value.uri.toString))
        .getOrElse(ResourceFactory.createResource(value.uri.toString))

      resource.label = value.name
      resource.identifier = value.nta
      resource.postalCodeUri = value.postCode
      resource.blocksUri = value.blocks
      resource.boroughUri = value.borough
      resource
    }
  }
}
