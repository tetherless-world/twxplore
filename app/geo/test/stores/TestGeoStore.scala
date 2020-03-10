package stores

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.GeoTestData
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.Feature
import models.graphql.FeatureQuery

object TestGeoStore extends GeoStore {
  override def getFeatures(limit: Int, offset: Int, query: FeatureQuery): List[Feature] = if (offset == 0) List(GeoTestData.feature) else List()

  override def getFeaturesCount(query: FeatureQuery) = 1

  override def getFeatureByUri(featureUri: Uri): Feature = if (featureUri == GeoTestData.feature.uri) GeoTestData.feature else throw new NoSuchElementException()
}
