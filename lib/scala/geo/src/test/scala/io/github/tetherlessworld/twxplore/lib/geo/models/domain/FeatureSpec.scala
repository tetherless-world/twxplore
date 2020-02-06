package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import io.github.tetherlessworld.twxplore.lib.test.models.domain.DomainModelSpec

class FeatureSpec extends DomainModelSpec {
  "The Feature companion object" should {
    "serialize and deserialize Features" in {
      testSerialization(TestData.feature)
    }
  }
}
