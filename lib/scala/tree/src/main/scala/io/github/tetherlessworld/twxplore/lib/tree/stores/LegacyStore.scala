package io.github.tetherlessworld.twxplore.lib.tree.stores

import com.google.inject.ImplementedBy
import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.models.selection.{SelectionArea, SelectionInput, SelectionResults}

@ImplementedBy(classOf[TwksLegacyStore])
trait LegacyStore {
  def getNtasByBorough(borough: Borough): List[Nta]

  def getBlocksByNta(nta: Nta): List[Block]

  def getBoroughsByCity(city: City): List[Borough]

  def getTrees(limit: Int, offset: Int): List[Tree]

  def getNtasByBoroughGeometry(borough: Uri): List[Feature]

  def getBlocksByNtaGeometry(Nta: Uri): List[Feature]

  def getTreesBySelection(selection: SelectionInput): SelectionResults

  def getBlockGeometries(): List[Feature]

  def getNtaGeometries(): List[Feature]

  def getBoroughGeometries(): List[Feature]

  def getCityGeometry(): Feature

  def getBlockGeometry(blockUri: Uri): Feature

  def getNtaGeometry(ntaUri: Uri): Feature

  def getBoroughGeometry(boroughUri: Uri): Feature

  def getCityGeometry(cityUri: Uri): Feature

  def getStateHierarchy(stateUri: Uri): List[SelectionArea]

  def getCityHierarchy(cityUri: Uri): List[SelectionArea]

  def getBoroughHierarchy(boroughUri: Uri): List[SelectionArea]

  def getNtaHierarchy(ntaUri: Uri): List[SelectionArea]

  def getBlockHierarchy(blockUri: Uri): List[SelectionArea]

  /*Getting geometries of specified areas*/
  def getGeometryOfCity(city: City): Geometry

  def getGeometryOfBoroughs(boroughs: List[Borough]): List[Geometry]

  def getGeometryOfBorough(borough: Borough): Geometry

  def getGeometryOfNtas(ntas: List[Nta]): List[Geometry]

  def getGeometryOfNta(nta: Nta): Geometry

  def getGeometryOfBlocks(blocks: List[Block]): List[Geometry]

  def getGeometryOfBlock(block: Block): Geometry
}
