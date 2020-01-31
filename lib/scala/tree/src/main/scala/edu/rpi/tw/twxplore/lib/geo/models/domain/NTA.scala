package edu.rpi.tw.twxplore.lib.geo.models.domain

import edu.rpi.tw.twxplore.lib.base.models.domain.vocabulary.{SIO, Schema, TREE}
import edu.rpi.tw.twxplore.lib.geo.models.domain.Block.BlockRdfReader
import edu.rpi.tw.twxplore.lib.geo.models.domain.Borough.BoroughRdfReader
import io.github.tetherlessworld.scena.{RdfReader, RdfWriter}
import org.apache.jena.rdf.model.{Resource, ResourceFactory}
import org.apache.jena.vocabulary.{DCTerms, RDFS}

final case class NTA(nta: String, ntaName: String, blocks: List[Int], borough: Int, postCode: Int, community: Int, councilDistrict: Int) extends Ordered[NTA]{
  def compare(that: NTA) = this.nta compare that.nta
  def addBlock(block: Block): NTA = {
    NTA(nta, ntaName, blocks :+ block.id, borough, postCode, community, councilDistrict)
  }
}

object NTA {
  implicit object NTARdfReader extends RdfReader[NTA] {
    override def read(resource: Resource): NTA = {
      val blockResources = resource.listProperties(SIO.isLocationOf)
      val blockList = List[Int]()
      while(blockResources.hasNext){
        blockList :+ BlockRdfReader.read(blockResources.next.getResource).id
      }
      NTA(
        nta = resource.getProperty(DCTerms.identifier).getObject().asLiteral().getString,
        ntaName = resource.getProperty(RDFS.label).getObject().asLiteral().getString(),
        borough = BoroughRdfReader.read(resource.getProperty(SIO.isLocationIn).getObject.asResource()).borocode,
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