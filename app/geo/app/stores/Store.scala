package stores

import models.domain.{Feature, Geometry}
import edu.rpi.tw.twks.uri.Uri

trait Store {
  def getFeatures(limit: Int, offset: Int): List[Feature]
  def getFeaturesCount(): Int
  def getFeatureByUri(featureUri: Uri): Feature
  def getFeaturesContaining(geometry: Geometry): List[Feature]
}
