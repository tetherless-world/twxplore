package stores

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.{Feature, Geometry, TestData}

object TestStore extends Store {
  override def getFeatures(limit: Int, offset: Int): List[Feature] = if (offset == 0) List(TestData.feature) else List()
  override def getFeaturesContaining(geometry: Geometry): List[Feature] = if(geometry != null && geometry.uri == TestData.geometry.uri) List(TestData.feature) else List()
  override def getFeaturesCount() = 1
  override def getFeatureByUri(featureUri: Uri): Feature = if (featureUri == TestData.feature.uri) TestData.feature else throw new NoSuchElementException()
}
