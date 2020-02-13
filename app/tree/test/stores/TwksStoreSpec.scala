package stores

import edu.rpi.tw.twks.client.RestTwksClientConfiguration
import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.base.stores.TwksStoreConfiguration
import io.github.tetherlessworld.twxplore.lib.tree.TestData
import org.scalatest.{Matchers, WordSpec}

class TwksStoreSpec extends WordSpec with Matchers {
  val storeConfiguration = new TwksStoreConfiguration(RestTwksClientConfiguration.builder().setServerBaseUrl("http://twks-server:8080").build())
  val store = new TwksStore(storeConfiguration)

  implicit class TreeUri(uri: Uri) { def lastPart = uri.toString.substring(uri.toString.lastIndexOf(":") + 1) }


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
//        "return a list a trees" in {
//          val feature = store.getTrees(1, 0)
//          feature should equal(currentTreeList)
//        }
        "return a list of ntas given a borough" in {
          val feature = store.getNtasByBorough(TestData.boroughMap(1))
          feature.sorted should equal(TestData.boroughMap(1).ntaList.map(nta => (TestData.ntaMap(nta.lastPart))).sorted)
        }
        "return a list of blocks given a nta" in {
          val feature = store.getBlocksByNta(TestData.ntaMap("MN14"))
          println(TestData.blockMap(106099))
          feature.sorted should equal (TestData.ntaMap("MN14").blocks.map(block => (TestData.blockMap(block.lastPart.toInt))).sorted)
        }
        "return a list of boroughs given a city" in {
          val feature = store.getBoroughsByCity(TestData.city)
          feature.size should equal(TestData.city.boroughs.size)
        }

      }
    }
  }

}

