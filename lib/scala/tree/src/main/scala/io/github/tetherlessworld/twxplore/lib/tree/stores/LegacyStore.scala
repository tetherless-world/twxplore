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

  def getNtaFeaturesByBorough(borough: Uri): List[Feature]

  def getBlockFeaturesByNta(nta: Uri): List[Feature]

  def getTreesBySelection(selection: SelectionInput): SelectionResults

  def getBlockFeatures(): List[Feature]

  def getNtaFeatures(): List[Feature]

  def getBoroughFeatures(): List[Feature]

  def getCityFeature(): Feature

  def getBlockFeature(blockUri: Uri): Feature

  def getNtaFeature(ntaUri: Uri): Feature

  def getBoroughFeature(boroughUri: Uri): Feature

  def getCityFeature(cityUri: Uri): Feature

  def getStateHierarchy(stateUri: Uri): List[SelectionArea]

  def getCityHierarchy(cityUri: Uri): List[SelectionArea]

  def getBoroughHierarchy(boroughUri: Uri): List[SelectionArea]

  def getNtaHierarchy(ntaUri: Uri): List[SelectionArea]

  def getBlockHierarchy(blockUri: Uri): List[SelectionArea]

  /*Getting geometries of specified areas*/
  def getCityGeometry(city: City): Geometry

  def getBoroughGeometries(boroughs: List[Borough]): List[Geometry]

  def getBoroughGeometry(borough: Borough): Geometry

  def getNtaGeometries(ntas: List[Nta]): List[Geometry]

  def getNtaGeometry(nta: Nta): Geometry

  def getBlockGeometries(blocks: List[Block]): List[Geometry]

  def getBlockGeometry(block: Block): Geometry
}
