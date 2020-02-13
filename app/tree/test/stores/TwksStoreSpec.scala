package stores

import edu.rpi.tw.twks.client.RestTwksClientConfiguration
import io.github.tetherlessworld.twxplore.lib.base.stores.TwksStoreConfiguration
import io.github.tetherlessworld.twxplore.lib.tree.TestData
import org.scalatest.{Matchers, WordSpec}

class TwksStoreSpec extends WordSpec with Matchers {
  val storeConfiguration = new TwksStoreConfiguration(RestTwksClientConfiguration.builder().setServerBaseUrl("http://twks-server:8080").build())
  val store = new TwksStore(storeConfiguration)

  "Test Twks Store" can {
    val currentTreeList = TestData.treeList

    "a valid URI" should {
      "return a list a trees" in {
        val feature = TestStore.getTrees(10, 0)
        feature should equal(currentTreeList)
      }
    }
    "Twks Store" can {
      val currentTreeList = TestData.treeList

      "a valid URI" should {
        "return a list a trees" in {
          store.getTrees
        }
      }
    }
    //
    //    "a valid geometry" should {
    //      "return a valid feature list" in {
    //        val featureList = TestStore.getFeaturesContaining(currentGeometry)
    //        featureList should equal(List(TestData.feature))
    //      }
    //    }
    //
    //    "an invalid geometry" should {
    //      "return an empty feature list" in {
    //        val featureList = TestStore.getFeaturesContaining(null)
    //        featureList should equal(List())
//      }
//    }
//
//    "an invalid URI" should {
//      "produce NoSuchElementException" in {
//        intercept[NoSuchElementException] {
//          TestStore.getFeatureByUri(null)
//        }
//      }
//    }
  }

}

