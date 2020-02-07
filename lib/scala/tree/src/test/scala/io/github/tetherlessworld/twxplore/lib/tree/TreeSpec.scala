package io.github.tetherlessworld.twxplore.lib.tree

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.Rdf
import io.github.tetherlessworld.twxplore.lib.base.models.domain._
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.Tree
import org.apache.jena.rdf.model.{ModelFactory, Resource}
import org.scalatest.{Matchers, WordSpec}

class TreeSpec extends WordSpec with Matchers {
  implicit class TreeSpecResource(val resource: Resource)
    extends RdfProperties with RdfsProperties with SioProperties with TreeTermsProperties with DCTermsProperties with SchemaProperties

  "TreeSpec" can {
    val tree = TestData.treeList.head
    val model = ModelFactory.createDefaultModel()
    var treeResourceOption = Option(Rdf.write[Tree](model, tree))
    "a valid tree write" should {

      "return a nonempty resource" in {
        treeResourceOption should not be(None)
      }
    }

    val treeResource = treeResourceOption.get

    "tree resource" should {
      "have a specific ID" in {
        treeResource.identifier.get should equal ("180683")
      }

      "point to specific city" in {
        treeResource.city.get should equal("New York City")
      }
      "point to a specific state" in {
        treeResource.state.get should equal ("New York")
      }
      "point to a specific borough" in {
        treeResource.borough.get should equal ("Queens")
      }

      "point to a specific NTA" in {
        treeResource.NTA.get should equal ("Forest Hills")
      }

      "point to a specific block" in {
        treeResource.block.get should equal ("348711")
      }
    }

    val treeRead = Rdf.read[Tree](treeResource)
    val state = treeRead.state
    val city = treeRead.city
    val borough = treeRead.borough
    val nta = treeRead.NTA
    val block = treeRead.block

    "a tree derived from a resource" should {
      "have a specific ID" in {
        treeRead.id should equal (180683)
      }

      "point to specific city" in {
        treeRead.city.name should equal("New York City")
      }

      "point to a specific state" in {
        treeRead.state.name should equal ("New York")
      }

      "point to a specific borough" in {
        treeRead.borough.name should equal ("Queens")
      }

      "point to a specific NTA" in {
        treeRead.NTA.name should equal ("Forest Hills")
      }

      "point to a specific block" in {
        treeRead.block.id should equal (348711)
      }
    }

    "a read from a state resource" should {
      "have a specific state name" in {
        state.name should equal ("New York")
      }

      "have a specific list of cities" in {
        state.cities.contains(Uri.parse("urn:treedata:resource:city:New York City"))
      }
    }

    "a read from a city resource" should {
      "have a specific city name" in {
        city.name should equal ("New York City")
      }

      "have 4 boroughs" in {
        city.boroughs.size should equal (4)
      }

      "have a specific list of boroughs" in {
        assert(city.boroughs.contains( Uri.parse("urn:treedata:resource:borough:1")))
      }

      "have 8 postcodes" in {
        city.postcodes.size should equal (8)
      }

      "have a specific list of postcodes" in {
        assert(city.postcodes.contains(Uri.parse("urn:treedata:resource:postcode:11375")))
      }

      "have a specific state it resides in" in {
        city.state.toString should equal ("urn:treedata:resource:state:New_York")
      }
    }

    "a read from a borough resource" should {
      "have a specific borough identifier" in {
        borough.name should equal ("Queens")
        borough.borocode should equal (4)
      }

      "have 2 NTAs" in {
        borough.ntaList.size should equal (2)
      }

      "have a specific list of NTAs" in {
        assert(borough.ntaList.contains( Uri.parse("urn:treedata:resource:nta:QN17")))
      }

      "have a specific city" in {
        borough.city.toString should equal("urn:treedata:resource:city:New_York_City")
      }
    }

    "a read from a NTA resource" should {
      "have a specific nta name" in {
        nta.name should equal("Forest Hills")
        nta.nta should equal("QN17")
      }

      "have a specific list of blocks" in {
        assert(nta.blocks.contains(Uri.parse("urn:treedata:resource:block:348711")))
      }

      "point to a specific borough" in {
        nta.borough.toString should equal("urn:treedata:resource:borough:4")
      }

      "point to a specific postal code area" in {
        nta.postCode.toString should equal ("urn:treedata:resource:postcode:11375")
      }
    }

    "a read from a block resource" should {
      "have a specific block id" in {
        block.id should equal (348711)
      }

      "have a specific NTA" in {
        block.nta.toString should equal ("urn:treedata:resource:NTA:QN17")
      }
    }
  }
}
