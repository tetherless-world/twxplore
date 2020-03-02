package io.github.tetherlessworld.twxplore.lib.tree.stores

import com.google.inject.ImplementedBy
import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._

@ImplementedBy(classOf[TwksFeatureStore])
trait FeatureStore {
  def getNtaFeaturesByBorough(borough: Uri): List[Feature]

  def getBlockFeaturesByNta(nta: Uri): List[Feature]

  def getBlockFeatures(): List[Feature]

  def getNtaFeatures(): List[Feature]

  def getBoroughFeatures(): List[Feature]

  def getCityFeature(): Feature

  def getBlockFeature(blockUri: Uri): Feature

  def getNtaFeature(ntaUri: Uri): Feature

  def getBoroughFeature(boroughUri: Uri): Feature

  def getCityFeature(cityUri: Uri): Feature

  def getCityGeometry(city: City): Geometry

  def getBoroughGeometries(boroughs: List[Borough]): List[Geometry]

  def getBoroughGeometry(borough: Borough): Geometry

  def getNtaGeometries(ntas: List[Nta]): List[Geometry]

  def getNtaGeometry(nta: Nta): Geometry

  def getBlockGeometries(blocks: List[Block]): List[Geometry]

  def getBlockGeometry(block: Block): Geometry
}
