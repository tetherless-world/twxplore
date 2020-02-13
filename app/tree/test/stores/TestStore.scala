package stores

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.TestData

object TestStore extends Store {
  private def featureByUri[Key, Feature](uri: Uri, map: Map[Key, Feature]): Feature = {
    val id = uri.toString.substring(uri.toString.lastIndexOf(":")+ 1)
    map(id.asInstanceOf[Key])
  }

  override def getTrees(limit: Int, offset: Int): List[Tree] = if (offset == 0) TestData.treeList else List()

  override def getNtasByBorough(borough: Borough): List[Nta] = if (borough != null && borough == TestData.boroughMap(1)) TestData.boroughMap(1).ntaList.map(nta => featureByUri(nta, TestData.ntaMap)) else List()

  override def getBlocksByNta(nta: Nta): List[Block] = if (nta != null && nta == TestData.ntaMap("MN14")) TestData.ntaMap("MN14").blocks.map(block => featureByUri(block, TestData.blockMap)) else List()

  override def getBoroughsByCity(city: City): List[Borough] = if (city != null && city == TestData.city) TestData.city.boroughs.map(borough => featureByUri(borough, TestData.boroughMap)) else List()
}
