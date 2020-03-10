package stores

import io.github.tetherlessworld.twxplore.lib.geo.GeoTestData
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.FeatureType
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

    "get all features" in {
      val actual = sut.getFeatures(limit = 10, offset = 0, query = FeatureQuery(containsWkt = None, `type` = None, withinWkt = None))
      actual should equal(List(GeoTestData.feature))
    }

    "get features with a given type" in {
      val actual = sut.getFeatures(limit = 10, offset = 0, query = FeatureQuery(containsWkt = None, `type` = GeoTestData.feature.`type`, withinWkt = None))
      actual should equal(List(GeoTestData.feature))
    }

    "exclude features that don't match a type" in {
      val actual = sut.getFeatures(limit = 10, offset = 0, query = FeatureQuery(containsWkt = None, `type` = Some(FeatureType.MilitaryInstallation), withinWkt = None))
      actual should equal(List())
    }

//    "get features containing a geometry" in {
//      val actual = sut.getFeatures(limit = 10, offset = 0, query = FeatureQuery(containsWkt = Some("POINT (30 10)"), `type` = None, withinWkt = None))
//      actual should equal(List(GeoTestData.feature))
//    }
//
//    "get features within a geometry" in {
//      val actual = sut.getFeatures(limit = 10, offset = 0, query = FeatureQuery(containsWkt = None, `type` = None, withinWkt = Some(GeoTestData.geometry.wkt)))
//      actual should equal(List(GeoTestData.feature))
//    }
  }
}

