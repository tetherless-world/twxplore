package stores

import io.github.tetherlessworld.twxplore.lib.tree.TestData
import org.scalatest.{Matchers, WordSpec}

class TwksStoreSpec extends WordSpec with Matchers {
  // If you're going to populate the store yourself:
  //  val store = new TwksStore(new DirectTwksClient(new MemTwks(MemTwksConfiguration.builder().build())))
  // Populate here

  // If using a store that's been pre-populated out-of-band
  //  val store = new TwksStore(new RestTwksClient(RestTwksClientConfiguration.builder().setServerBaseUrl("http://twks-server:8080").build()))

  //implicit class TreeUri(uri: Uri) { def lastPart = uri.toString.substring(uri.toString.lastIndexOf(":") + 1) }


  "Test Twks Store" can {
    val currentTreeList = TestData.treeList

    "a valid URI" should {
      "return a list a trees" in {
        val feature = TestStore.getTrees(10, 0)
        feature should equal(currentTreeList)
      }
    }
    "Twks Store" can {
//      val currentTreeList = TestData.treeList
//
//      "a valid URI" should {
//        "return a list a trees" in {
//          val feature = store.getTrees(10, 0)
//          feature.size should equal(currentTreeList.size)
//        }
//        "return a list of ntas given a borough" in {
//          val feature = store.getNtasByBorough(TestData.boroughMap(1))
//          feature.sorted should equal(TestData.boroughMap(1).ntaList.map(nta => (TestData.ntaMap(nta.lastPart))).sorted)
//        }
//        "return a list of blocks given a nta" in {
//          val feature = store.getBlocksByNta(TestData.ntaMap("MN14"))
//          println(TestData.blockMap(106099))
//          feature.sorted should equal (TestData.ntaMap("MN14").blocks.map(block => (TestData.blockMap(block.lastPart.toInt))).sorted)
//        }
//        "return a list of boroughs given a city" in {
//          val feature = store.getBoroughsByCity(TestData.city)
//          feature.size should equal(TestData.city.boroughs.size)
//        }
//        "return a geometry given a city" in {
//          val feature = store.getGeometryOfCity(TestData.city)
//          feature should equal(TestData.cityGeoMap("New York").geometry)
//        }
//
//        "return a geometry given a borough" in {
//          val feature = store.getGeometryOfBorough(TestData.boroughMap(4))
//          feature should equal(TestData.boroughGeoMap("Queens").geometry)
//        }
//
//        "return a geometry given a nta" in {
//          val feature = store.getGeometryOfNta(TestData.ntaMap("MN14"))
//          feature should equal(TestData.ntaGeoMap("Lincoln Square").geometry)
//        }
//
//        "return a geometry given a block" in {
//          val feature = store.getGeometryOfBlock(TestData.blockMap(348711))
//          feature should equal(TestData.blockGeoMap("348711").geometry)
//        }
//      }
   }
  }
}

