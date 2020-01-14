package stores

import models.domain.Feature

object TestStore extends Store {
  override def getFeatures(limit: Int, offset: Int): List[Feature] = if (offset == 0) List(TestData.feature) else List()
}
