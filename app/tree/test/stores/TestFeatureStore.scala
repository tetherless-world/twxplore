package stores

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.TestData
import io.github.tetherlessworld.twxplore.lib.tree.stores.FeatureStore

object TestFeatureStore extends FeatureStore {
  override def getCityGeometry(city: City): Geometry = if (city != null && city == TestData.city) TestData.cityGeoMap("New York").geometry else null

  override def getBoroughGeometries(boroughs: List[Borough]): List[Geometry] = {
    boroughs.map(borough => {
      if (borough != null && borough == TestData.boroughMap(borough.borocode))
        TestData.boroughGeoMap(borough.name).geometry
    }).toList.asInstanceOf[List[Geometry]]
  }

  //override def getGeometryOfBoroughs(boroughs: List[Borough]): List[Geometry] = ???

  override def getBoroughGeometry(borough: Borough): Geometry = getBoroughGeometries(List(borough)).head

  override def getNtaGeometries(ntas: List[Nta]): List[Geometry] = {
    ntas.map(nta => {
      if (nta != null && nta == TestData.ntaMap(nta.nta))
        TestData.ntaGeoMap(nta.name).geometry
    }).toList.asInstanceOf[List[Geometry]]
  }

  override def getNtaGeometry(nta: Nta): Geometry = getNtaGeometries(List(nta)).head

  override def getBlockGeometries(blocks: List[Block]): List[Geometry] = {
    blocks.map(block => {
      if (block != null && block == TestData.blockMap(block.id))
        TestData.blockGeoMap(block.id.toString).geometry
    }).toList.asInstanceOf[List[Geometry]]
  }

  override def getBlockGeometry(block: Block): Geometry = getBlockGeometries(List(block)).head

  override def getBlockFeatures(): List[Feature] = ???

  override def getNtaFeatures(): List[Feature] = ???

  override def getBoroughFeatures(): List[Feature] = ???

  override def getCityFeature(): Feature = ???

  override def getNtaFeaturesByBorough(borough: Uri): List[Feature] = ???

  override def getBlockFeaturesByNta(nta: Uri): List[Feature] = ???

  override def getBlockFeature(blockUri: Uri): Feature = {
    if (blockUri != null) {
      Feature(TestData.geometry, Uri.parse("http://example.com/geometry"))
    } else {
      null
    }
  }

  override def getNtaFeature(ntaUri: Uri): Feature = {
    if (ntaUri != null) {
      Feature(TestData.geometry, Uri.parse("http://example.com/geometry"))
    } else {
      null
    }
  }

  override def getBoroughFeature(boroughUri: Uri): Feature = {
    if (boroughUri != null) {
      Feature(TestData.geometry, Uri.parse("http://example.com/geometry"))
    } else {
      null
    }
  }

  override def getCityFeature(boroughUri: Uri): Feature = {
    if (boroughUri != null) {
      Feature(TestData.geometry, Uri.parse("http://example.com/geometry"))
    } else {
      null
    }
  }
}
