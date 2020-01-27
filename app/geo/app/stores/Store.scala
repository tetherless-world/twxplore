package stores

import edu.rpi.tw.twks.uri.Uri
import edu.rpi.tw.twxplore.lib.geo.models.domain.{Feature, Geometry}

trait Store {
  def getFeatures(limit: Int, offset: Int): List[Feature]
  def getFeaturesCount(): Int
  def getFeatureByUri(featureUri: Uri): Feature
  def getFeaturesContaining(geometry: Geometry): List[Feature]
}
