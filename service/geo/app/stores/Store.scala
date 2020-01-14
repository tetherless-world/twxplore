package stores

import models.domain.{Feature, Geometry}

trait Store {
  def getFeatures(limit: Int, offset: Int): List[Feature]

//  def getFeaturesContaining(geometry: Geometry): List[Feature]
}
