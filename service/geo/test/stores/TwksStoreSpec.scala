package stores

import org.scalatest.{Matchers, WordSpec}

class TwksStoreSpec extends WordSpec with Matchers{
  "Twks Store" can {
    val currentUri = TestData.feature.uri

    "a valid URI" should {
      "return a valid feature" in {
        val feature = TestStore.getFeatureByUri(currentUri)
        feature should equal(TestData.feature)
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

