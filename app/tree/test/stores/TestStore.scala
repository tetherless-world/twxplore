package stores

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.TestData

object TestStore extends Store {
  implicit class TreeUri(uri: Uri) { def lastPart = uri.toString.substring(uri.toString.lastIndexOf(":") + 1) }

  override def getTrees(limit: Int, offset: Int): List[Tree] = if (offset == 0) TestData.treeList else List()

  override def getNtasByBorough(borough: Borough): List[Nta] = if (borough != null && borough == TestData.boroughMap(1)) TestData.boroughMap(1).ntaList.map(nta => TestData.ntaMap(nta.lastPart)) else List()

  override def getBlocksByNta(nta: Nta): List[Block] = if (nta != null && nta == TestData.ntaMap("MN14")) TestData.ntaMap("MN14").blocks.map(block => TestData.blockMap(block.lastPart.toInt)) else List()

  override def getBoroughsByCity(city: City): List[Borough] = if (city != null && city == TestData.city) TestData.city.boroughs.map(borough => TestData.boroughMap(borough.lastPart.toInt)) else List()
}
