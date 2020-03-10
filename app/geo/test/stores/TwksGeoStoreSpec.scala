package stores

import io.github.tetherlessworld.twxplore.lib.geo.GeoTestData
import io.github.tetherlessworld.twxplore.lib.geo.stores.TestTwks
import models.graphql.FeatureQuery
import org.scalatest.{Matchers, WordSpec}

class TwksGeoStoreSpec extends WordSpec with Matchers {
  "Twks Store" can {
    val sut = new TwksGeoStore(TestTwks.twksClient)

    "get a feature by URI" in {
      val actual = sut.getFeatureByUri(GeoTestData.feature.uri)
      actual should equal(GeoTestData.feature)
    }

    "get a count of features" in {
      val actual = sut.getFeaturesCount(FeatureQuery(containsWkt = None, `type` = None, withinWkt = None))
      actual should equal(1)
    }

    "get features with a given type" in {

    }
  }
}

