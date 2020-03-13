package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import io.github.tetherlessworld.twxplore.lib.base.models.domain.DomainModelSpec
import io.github.tetherlessworld.twxplore.lib.geo.GeoTestData

class GenericFeatureSpec extends DomainModelSpec {
  "The Feature companion object" should {
    "serialize and deserialize Features" in {
      testSerialization(GeoTestData.feature)
    }
  }
}
