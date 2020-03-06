package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{DcTermsProperties, RdfProperties, RdfReader, RdfWriter, RdfsProperties}
import io.github.tetherlessworld.twxplore.lib.base.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.models.domain.TreeProperties
import io.github.tetherlessworld.twxplore.lib.tree.models.domain.vocabulary.TREE
import org.apache.jena.rdf.model.{Model, Resource, ResourceFactory}

//Nta
final case class Nta(nta: String, name: String, blocks: List[Uri], borough: Uri, postCode: Uri, feature: Uri, uri: Uri) extends Ordered[Nta] {
  def compare(that: Nta) = this.nta compare that.nta

  def addBlock(block: Block): Nta = {
    this.copy(blocks = blocks :+ block.uri)
  }
}

object Nta {

  implicit class NtaResource(val resource: Resource)
    extends RdfProperties with RdfsProperties with SioProperties with TreeProperties with SchemaProperties with DcTermsProperties with GeoProperties


  implicit object NtaRdfReader extends RdfReader[Nta] {
    override def read(resource: Resource): Nta = {
      Nta(
        nta = resource.identifier.get,
        name = resource.label.get,
        borough = resource.boroughUri.get,
        postCode = resource.postalCodeUri.get,
        blocks = resource.blocksUri,
        feature = resource.spatialDimensionProp.get,
        uri = Uri.parse(resource.getURI)
      )
    }
  }

  implicit object NtaRdfWriter extends RdfWriter[Nta] {
    override def write(model: Model, value: Nta): Resource = {
      val resource = Option(model.getResource(value.uri.toString))
        .getOrElse(ResourceFactory.createResource(value.uri.toString))

      resource.label = value.name
      resource.identifier = value.nta
      resource.postalCodeUri = value.postCode
      resource.blocksUri = value.blocks
      resource.boroughUri = value.borough
      resource.spatialDimensionProp = value.feature
      resource.`type` = ResourceFactory.createResource(TREE.NTA_URI_PREFIX)
      resource
    }
  }

}
