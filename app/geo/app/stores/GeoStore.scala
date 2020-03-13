package stores

import com.google.inject.ImplementedBy
import edu.rpi.tw.twks.uri.Uri
import models.domain.Feature
import models.graphql.FeatureQuery

@ImplementedBy(classOf[TwksGeoStore])
trait GeoStore {
  def getFeatures(limit: Option[Int], offset: Option[Int], query: FeatureQuery): List[Feature]

  def getFeaturesCount(query: FeatureQuery): Int

  def getFeatureByUri(featureUri: Uri): Feature
}
