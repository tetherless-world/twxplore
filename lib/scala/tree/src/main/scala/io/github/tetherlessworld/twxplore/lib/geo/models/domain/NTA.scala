package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{RdfReader, RdfWriter}
import io.github.tetherlessworld.twxplore.lib.base.models.domain.vocabulary.{SIO, Schema, TREE}
import io.github.tetherlessworld.twxplore.lib.base.models.domain._
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.Block.BlockRdfReader
import org.apache.jena.rdf.model.{Resource, ResourceFactory}
import org.apache.jena.vocabulary.{DCTerms, RDFS}

//Nta
final case class NTA(nta: String, ntaName: String, blocks: List[Int], borough: Option[Uri], postCode: Int) extends Ordered[NTA] {
  val uri = Uri.parse("urn:treedata:nta:") + nta

  def compare(that: NTA) = this.nta compare that.nta

  def addBlock(block: Block): NTA = {
    NTA(nta, ntaName, blocks :+ block.id, borough, postCode, community, councilDistrict)
  }
}

object NTA {
  implicit class NTAResource(val resource: Resource)
    extends RdfProperties with RdfsProperties with SioProperties with TreeTermsProperties with SchemaProperties with DCTermsProperties


  implicit object NTARdfReader extends RdfReader[NTA] {
    override def read(resource: Resource): NTA = {
      val blockResources = resource.listProperties(SIO.isLocationOf)
      val blockList = List[Int]()
      while(blockResources.hasNext){
        blockList :+ BlockRdfReader.read(blockResources.next.getResource).id
      }
      NTA(
        nta = resource.identifier.get,
        ntaName = resource.label.get,
        borough = resource.boroughUri,
        postCode = resource.getProperty(Schema.postalCode).getObject.asLiteral().getInt,
        blocks = blockList,
        community = resource.getProperty(SIO.hasAttribute, TREE.URI + "Community").getObject().asLiteral().getInt,
        councilDistrict = resource.getProperty(SIO.hasAttribute, TREE.URI + "CouncilDistrict").getObject().asLiteral().getInt
      )
    }
  }

  implicit object NTARdfWriter extends RdfWriter[NTA] {
    override def write(value: NTA): Resource = {
      val resource = ResourceFactory.createResource(TREE.URI + "NTA")
      resource.addProperty(RDFS.label, value.ntaName)
      resource.addProperty(DCTerms.identifier, value.nta)
      resource.addProperty(Schema.postalCode, value.postCode.toString)
      resource.addProperty(SIO.hasAttribute, TREE.URI + "Community").addProperty(SIO.hasValue, value.community.toString)
      resource.addProperty(SIO.hasAttribute, TREE.URI + "CouncilDistrict").addProperty(SIO.hasValue, value.councilDistrict.toString)
      for( block <- value.blocks) {
        resource.addProperty(SIO.isLocationOf, block.toString)
      }
      resource
    }
  }
}
