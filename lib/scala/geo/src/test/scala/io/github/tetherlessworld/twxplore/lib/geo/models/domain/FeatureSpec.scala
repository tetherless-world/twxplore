package io.github.tetherlessworld.twxplore.lib.geo.models.domain

class FeatureSpec extends DomainModelSpec {
  "The Feature companion object" should {
    "serialize and deserialize Features" in {
      testSerialization(TestData.feature)
    }
  }
}
