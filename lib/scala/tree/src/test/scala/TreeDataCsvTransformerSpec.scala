import io.github.tetherlessworld.twxplore.lib.tree.TreeDataCsvTransformer

class TreeDataCsvTransformerSpec extends WordSpec with Matchers {
  "TreeDataCsvTranformerSpec" can {
    val testData = TreeDataCsvTransformer("./resources/test_treedata.csv").parseCsv()

    "a valid csv" should {
      "a valid mapping of trees" should {
        "return a nonempty mapping of trees" in {
          assert(testData.treeMap.length != 0)
        }

        "return a mapping of 10 trees" in {
          testData.treeMap.length should equal(10)
        }
      }

      "a valid tree" should {
        val testTree = testData.treeList[0]
        "have a specific address" {
          assert(testTree.address != "")
        }
      }

      "a valid mapping blocks" should {
        "return a nonempty mapping of blocks" in {
          assert(testData.blockMap.length != 0)
        }

        "return a mapping of 10 blocks" in {
          testData.treeMap.length should equal(10)
        }
      }

      "a valid mapping of nta" should {
        "return a nonempty mapping of nta" in {
          testData.treeMap.length should not equal (0)
        }

        "return a mapping of 8 nta" in {
          testData.treeMap.length should equal(8)
        }
      }

      "a valid mapping of borough" should {
        "return a nonempty mapping of borough" in {
          assert(testData.boroughMap.length != 0)
        }
        "return a mapping of 4 boroughs" in {
          testData.boroughMap.length should equal (4)
        }
      }

      "a valid mapping of postalCode" should {
        "return a nonempty mapping of postalcode" in {
          assert(testData.postalCode.length != 0)
        }

        "return a mapping of 8 postal codes" in {
          testData.postalCode.length should equal (8)
        }
      }
    }
  }
}