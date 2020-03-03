package io.github.tetherlessworld.twxplore.lib.tree.stores

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.TreeTestData
import io.github.tetherlessworld.twxplore.lib.tree.models.selection.SelectionArea

object TestHierarchyStore extends HierarchyStore {

  implicit class TreeUri(uri: Uri) {
    def lastPart = uri.toString.substring(uri.toString.lastIndexOf(":") + 1)
  }

  override def getNtasByBorough(borough: Borough): List[Nta] = if (borough != null && borough == TreeTestData.boroughMap(1)) TreeTestData.boroughMap(1).ntaList.map(nta => TreeTestData.ntaMap(nta.lastPart)) else List()

  override def getBlocksByNta(nta: Nta): List[Block] = if (nta != null && nta == TreeTestData.ntaMap("MN14")) TreeTestData.ntaMap("MN14").blocks.map(block => TreeTestData.blockMap(block.lastPart.toInt)) else List()

  override def getBoroughsByCity(city: City): List[Borough] = if (city != null && city == TreeTestData.city) TreeTestData.city.boroughs.map(borough => TreeTestData.boroughMap(borough.lastPart.toInt)) else List()


  override def getBlockHierarchy(block: Uri): List[SelectionArea] = ???


  override def getStateHierarchy(stateUri: Uri): List[SelectionArea] = ???

  override def getCityHierarchy(cityUri: Uri): List[SelectionArea] = ???

  override def getBoroughHierarchy(boroughUri: Uri): List[SelectionArea] = ???

  override def getNtaHierarchy(ntaUri: Uri): List[SelectionArea] = ???
}
