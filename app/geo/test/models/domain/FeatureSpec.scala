package models.domain

import io.github.tetherlessworld.twxplore.lib.base.models.domain.DomainModelSpec
import models.GeoTestData

class FeatureSpec extends DomainModelSpec {
  "The Feature companion object" should {
    "serialize and deserialize Features" in {
      testSerialization(GeoTestData.feature)
    }
  }
}
