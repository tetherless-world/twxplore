package stores

import com.google.inject.ImplementedBy
import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.GenericFeature
import models.graphql.FeatureQuery

@ImplementedBy(classOf[TwksGeoStore])
trait GeoStore {
  def getFeatures(limit: Option[Int], offset: Option[Int], query: FeatureQuery): List[GenericFeature]

  def getFeaturesCount(query: FeatureQuery): Int

  def getFeatureByUri(featureUri: Uri): GenericFeature
}
