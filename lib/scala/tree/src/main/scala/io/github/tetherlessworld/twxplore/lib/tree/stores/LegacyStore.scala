package io.github.tetherlessworld.twxplore.lib.tree.stores

import com.google.inject.ImplementedBy
import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.models.selection.SelectionArea

@ImplementedBy(classOf[TwksLegacyStore])
trait LegacyStore {
  def getNtasByBorough(borough: Borough): List[Nta]

  def getBlocksByNta(nta: Nta): List[Block]

  def getBoroughsByCity(city: City): List[Borough]

  def getStateHierarchy(stateUri: Uri): List[SelectionArea]

  def getCityHierarchy(cityUri: Uri): List[SelectionArea]

  def getBoroughHierarchy(boroughUri: Uri): List[SelectionArea]

  def getNtaHierarchy(ntaUri: Uri): List[SelectionArea]

  def getBlockHierarchy(blockUri: Uri): List[SelectionArea]
}
