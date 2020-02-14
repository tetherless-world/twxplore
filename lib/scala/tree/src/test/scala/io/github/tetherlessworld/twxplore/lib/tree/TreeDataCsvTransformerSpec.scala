package io.github.tetherlessworld.twxplore.lib.test

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.tree.TestData
import org.scalatest.{Matchers, WordSpec}


class TreeDataCsvTransformerSpec extends WordSpec with Matchers {

  implicit class TreeUri(uri: Uri) { def lastPart = uri.toString.substring(uri.toString.lastIndexOf(":") + 1) }
  "TreeDataCsvTranformerSpec" can {
    val testData = TestData

    "a valid csv" should {
      "a valid mapping of trees" should {
        "return a nonempty mapping of trees" in {
          assert(testData.treeList.size != 0)
        }

        "return a list of 10 trees" in {
          testData.treeList.size should equal(10)
        }
      }

      "a valid tree (the head)" should {
        val testTree = testData.treeList.head
        "have a specific address" in {
          testTree.address should equal("108-005 70 AVENUE")
        }

        "be within a specific block" in {
          val blockMap = TestData.blockMap
          blockMap(testTree.block.lastPart.toInt).id should equal(348711)
        }

        "be within a specific nta" in {
          val ntaMap = TestData.ntaMap
          ntaMap(testTree.NTA.lastPart).nta should equal("QN17")
        }

        "be within a specific borough" in {
          val boroughMap = TestData.boroughMap
          boroughMap(testTree.borough.lastPart.toInt).name should equal ("Queens")
        }

        "be within a specific city" in {
          val city = TestData.city
          city.name should equal("New York City")
        }

        "be within a specific state" in {
          val state = TestData.state
          state.name should equal("New York")
        }

        "have a block that references specified NTA" in {
          val blockMap = TestData.blockMap
          blockMap(testTree.block.lastPart.toInt).nta.toString should equal ("urn:treedata:resource:NTA:QN17")
        }

        "have the block contained within specified NTA" in {
          val ntaMap = TestData.ntaMap
          ntaMap(testTree.NTA.lastPart).blocks.contains(Uri.parse("urn:treedata:resource:block:348711"))
        }

        "have a nta that references specified borough" in {
          val ntaMap = TestData.ntaMap
          ntaMap(testTree.NTA.lastPart).borough.toString should equal ("urn:treedata:resource:borough:4")
        }

        "have the nta contained within specified borough" in {
          val boroughMap = TestData.boroughMap
          boroughMap(testTree.borough.lastPart.toInt).ntaList.contains(Uri.parse("urn:treedata:resource:NTA:QN17"))
        }

        "have the borough that references specified city" in {
          val boroughMap = TestData.boroughMap
          boroughMap(testTree.borough.lastPart.toInt).city.toString should equal ("urn:treedata:resource:city:New_York_City")
        }

        "have a borough contained within specified city" in {
          val city = TestData.city
          city.boroughs.contains(Uri.parse("urn:treedata:resource:borough:4"))
        }

        "have a city that references specified state" in {
          val city = TestData.city
          city.state.toString should equal ("urn:treedata:resource:state:New_York")
        }

      }

      "a valid mapping blocks" should {
        "return a nonempty mapping of blocks" in {
          assert(testData.blockMap.size != 0)
        }

        "return a mapping of 9 blocks" in {
          testData.blockMap.size should equal(9)
        }
      }

      "a valid mapping of nta" should {
        "return a nonempty mapping of nta" in {
          testData.ntaMap.size should not equal (0)
        }

        "return a mapping of 8 nta" in {
          testData.ntaMap.size should equal(8)
        }
      }

      "a valid mapping of borough" should {
        "return a nonempty mapping of borough" in {
          assert(testData.boroughMap.size != 0)
        }
        "return a mapping of 4 boroughs" in {
          testData.boroughMap.size should equal (4)
        }
      }

      "a valid mapping of postalCode" should {
        "return a nonempty mapping of postalcode" in {
          assert(testData.postalCode.size != 0)
        }

        "return a mapping of 8 postal codes" in {
          testData.postalCode.size should equal (8)
        }
      }
    }
  }
}
