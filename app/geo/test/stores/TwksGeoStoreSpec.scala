package stores

import models.domain.FeatureType
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
      val actual = sut.getFeaturesCount(FeatureQuery(containsFeatureUri = None, types = None, withinFeatureUri = None))
      actual should equal(3)
    }

    "get all features without limit and offset" in {
      val actual = sut.getFeatures(limit = None, offset = None, query = FeatureQuery(containsFeatureUri = None, types = None, withinFeatureUri = None))
      actual should contain(GeoTestData.containingFeature)
      actual should contain(GeoTestData.containedFeature)
      actual should contain(GeoTestData.feature)
    }

    "get all features using limit and offset" in {
      val actual = sut.getFeatures(limit = Some(10), offset = Some(0), query = FeatureQuery(containsFeatureUri = None, types = None, withinFeatureUri = None))
      actual should contain(GeoTestData.containingFeature)
      actual should contain(GeoTestData.containedFeature)
      actual should contain(GeoTestData.feature)
    }

    "get features with a given type" in {
      val actual = sut.getFeatures(limit = Some(10), offset = Some(0), query = FeatureQuery(containsFeatureUri = None, types = Some(List(GeoTestData.feature.`type`.get)), withinFeatureUri = None))
      actual should equal(List(GeoTestData.feature))
    }

    "get features with either of two types" in {
      val actual = sut.getFeatures(limit = None, offset = None, query = FeatureQuery(containsFeatureUri = None, types = Some(List(GeoTestData.containedFeature.`type`.get, GeoTestData.feature.`type`.get)), withinFeatureUri = None))
      actual should contain(GeoTestData.feature)
      actual should contain(GeoTestData.containedFeature)
      actual should not contain(GeoTestData.containingFeature)
    }

    "exclude features that don't match a type" in {
      val actual = sut.getFeatures(limit = Some(10), offset = Some(0), query = FeatureQuery(containsFeatureUri = None, types = Some(List(FeatureType.MilitaryInstallation)), withinFeatureUri = None))
      actual should contain(GeoTestData.containedFeature)
    }

    "get features containing a feature" in {
      val actual = sut.getFeatures(limit = Some(10), offset = Some(0), query = FeatureQuery(containsFeatureUri = Some(GeoTestData.feature.uri), types = None, withinFeatureUri = None))
      actual should contain(GeoTestData.containingFeature)
      actual should not contain(GeoTestData.feature) // sfContains includes the feature itself by default, but we explicitly exclude it
      actual should not contain(GeoTestData.containedFeature)
    }

    "get features within a feature" in {
      val actual = sut.getFeatures(limit = Some(10), offset = Some(0), query = FeatureQuery(containsFeatureUri = None, types = None, withinFeatureUri = Some(GeoTestData.feature.uri)))
      actual should contain(GeoTestData.containedFeature)
      actual should not contain(GeoTestData.feature) // sfWithin includes the feature itself by default, but we explicitly exclude it
      actual should not contain(GeoTestData.containingFeature)
    }
  }
}

