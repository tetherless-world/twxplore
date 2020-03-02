package io.github.tetherlessworld.twxplore.lib.tree.stores

import com.google.inject.ImplementedBy
import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.models.selection.{SelectionArea, SelectionGeometry, SelectionInput, SelectionResults}

@ImplementedBy(classOf[TwksLegacyStore])
trait LegacyStore {
  def getNtasByBorough(borough: Borough): List[Nta]

  def getBlocksByNta(nta: Nta): List[Block]

  def getBoroughsByCity(city: City): List[Borough]

  def getTrees(limit: Int, offset: Int): List[Tree]

  def getNtasByBoroughGeometry(borough: Uri): List[SelectionGeometry]

  def getBlocksByNtaGeometry(Nta: Uri): List[SelectionGeometry]

  def getTreesBySelection(selection: SelectionInput): SelectionResults

  def getBlockGeometries(): List[SelectionGeometry]

  def getNtaGeometries(): List[SelectionGeometry]

  def getBoroughGeometries(): List[SelectionGeometry]

  def getCityGeometry(): SelectionGeometry

  def getBlockGeometry(blockUri: Uri): SelectionGeometry

  def getNtaGeometry(ntaUri: Uri): SelectionGeometry

  def getBoroughGeometry(boroughUri: Uri): SelectionGeometry

  def getCityGeometry(cityUri: Uri): SelectionGeometry

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
