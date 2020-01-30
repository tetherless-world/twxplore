package edu.rpi.tw.twxplore.lib.geo.models.domain 

final case class NTA(nta: String, ntaName: String, blocks: List[Block], borough: Int, postCode: Int, community: Int, councilDistrict: Int) extends Ordered[NTA]{
  def compare(that: NTA) = this.nta compare that.nta
  def addBlock(block: Block): NTA = {
    NTA(nta, ntaName, blocks :+ block, borough, postCode, community, councilDistrict)
  }
}