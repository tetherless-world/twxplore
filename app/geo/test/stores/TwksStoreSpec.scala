package stores

import io.github.tetherlessworld.twxplore.lib.geo.models.domain.TestData
import org.scalatest.{Matchers, WordSpec}

class TwksStoreSpec extends WordSpec with Matchers{
  "Twks Store" can {
    val currentGeometry = TestData.geometry
    val currentUri = TestData.feature.uri

    "a valid URI" should {
      "return a valid feature" in {
        val feature = TestStore.getFeatureByUri(currentUri)
        feature should equal(TestData.feature)
      }
    }

    "a valid geometry" should {
      "return a valid feature list" in {
        val featureList = TestStore.getFeaturesContaining(currentGeometry)
        featureList should equal(List(TestData.feature))
      }
    }

    "an invalid geometry" should {
      "return an empty feature list" in {
        val featureList = TestStore.getFeaturesContaining(null)
        featureList should equal(List())
      }
    }

    "an invalid URI" should {
      "produce NoSuchElementException" in {
        intercept[NoSuchElementException] {
          TestStore.getFeatureByUri(null)
        }
      }
    }

  }

}

