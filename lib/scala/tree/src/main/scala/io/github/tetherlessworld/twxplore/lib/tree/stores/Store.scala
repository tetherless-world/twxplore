package io.github.tetherlessworld.twxplore.lib.tree.stores

import com.google.inject.ImplementedBy
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._

@ImplementedBy(classOf[TwksStore])
trait Store {
  def getNtasByBorough(borough: Borough): List[Nta]
  def getBlocksByNta(nta: Nta): List[Block]
  def getBoroughsByCity(city: City): List[Borough]
  def getTrees(limit: Int, offset: Int): List[Tree]

  //def getBlockHierarchy(block: Block): List[SelectionArea]

  /*Getting geometries of specified areas*/
  def getGeometryOfCity(city: City): Geometry
  def getGeometryOfBoroughs(boroughs: Vector[Borough]): List[Geometry]
  def getGeometryOfBorough(borough: Borough): Geometry
  def getGeometryOfNtas(ntas: Vector[Nta]): List[Geometry]
  def getGeometryOfNta(nta: Nta): Geometry
  def getGeometryOfBlocks(blocks: Vector[Block]): List[Geometry]
  def getGeometryOfBlock(block: Block): Geometry
}
