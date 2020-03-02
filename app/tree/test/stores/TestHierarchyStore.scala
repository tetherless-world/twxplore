package stores

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.TestData
import io.github.tetherlessworld.twxplore.lib.tree.models.selection.SelectionArea
import io.github.tetherlessworld.twxplore.lib.tree.stores.HierarchyStore

object TestHierarchyStore extends HierarchyStore {

  implicit class TreeUri(uri: Uri) {
    def lastPart = uri.toString.substring(uri.toString.lastIndexOf(":") + 1)
  }

  override def getNtasByBorough(borough: Borough): List[Nta] = if (borough != null && borough == TestData.boroughMap(1)) TestData.boroughMap(1).ntaList.map(nta => TestData.ntaMap(nta.lastPart)) else List()

  override def getBlocksByNta(nta: Nta): List[Block] = if (nta != null && nta == TestData.ntaMap("MN14")) TestData.ntaMap("MN14").blocks.map(block => TestData.blockMap(block.lastPart.toInt)) else List()

  override def getBoroughsByCity(city: City): List[Borough] = if (city != null && city == TestData.city) TestData.city.boroughs.map(borough => TestData.boroughMap(borough.lastPart.toInt)) else List()


  override def getBlockHierarchy(block: Uri): List[SelectionArea] = ???


  override def getStateHierarchy(stateUri: Uri): List[SelectionArea] = ???

  override def getCityHierarchy(cityUri: Uri): List[SelectionArea] = ???

  override def getBoroughHierarchy(boroughUri: Uri): List[SelectionArea] = ???

  override def getNtaHierarchy(ntaUri: Uri): List[SelectionArea] = ???
}
