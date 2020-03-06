package io.github.tetherlessworld.twxplore.lib.tree.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{DcTermsProperties, Rdf, RdfProperties, RdfsProperties}
import io.github.tetherlessworld.twxplore.lib.base.models.domain._
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.TreeTestData
import org.apache.jena.rdf.model.{ModelFactory, Resource}
import org.scalatest.{Matchers, WordSpec}

class TreeSpec extends WordSpec with Matchers {

  implicit class TreeSpecResource(val resource: Resource)
    extends RdfProperties with RdfsProperties with SioProperties with TreeProperties with DcTermsProperties with SchemaProperties with GeoProperties

  implicit class TreeUri(uri: Uri) {
    def lastPart = uri.toString.substring(uri.toString.lastIndexOf(":") + 1)
  }

  "TreeSpec" can {
    val testData = TreeTestData
    val tree = TreeTestData.treeList.head
    val model = ModelFactory.createDefaultModel()
    val treeResourceOption = Option(Rdf.write[Tree](model, tree))
    "a valid tree write" should {

      "return a nonempty resource" in {
        treeResourceOption should not be (None)
      }
    }

    val blockResource = Rdf.write[Block](model, TreeTestData.blockMap(tree.block.lastPart.toInt))
    val boroughResource = Rdf.write[Borough](model, TreeTestData.boroughMap(tree.borough.lastPart.toInt))
    val cityResource = Rdf.write[City](model, TreeTestData.city)
    val ntaResource = Rdf.write[Nta](model, TreeTestData.ntaMap(tree.NTA.lastPart))
    val postcodeResource = Rdf.write[Postcode](model, TreeTestData.postalCode(tree.postcode.lastPart.toInt))
    val stateResource = Rdf.write[State](model, TreeTestData.state)
    val cityFeatureResource = Rdf.write[Feature](model, TreeTestData.cityGeoMap("New York"))
    val boroughFeatureResource = Rdf.write[Feature](model, TreeTestData.boroughGeoMap("Queens"))
    val ntaFeatureResource = Rdf.write[Feature](model, TreeTestData.ntaGeoMap("Forest Hills"))
    val blockFeatureResource = Rdf.write[Feature](model, TreeTestData.blockGeoMap("348711"))


    val speciesResource = Rdf.write[TreeSpecies](model, TreeTestData.treeSpeciesMap(tree.species.get.lastPart.replace("_", " ")))

    val treeResource = treeResourceOption.get

    "tree resource" should {
      "have a specific ID" in {
        treeResource.identifier.get should equal("180683")
      }

//      "point to specific city" in {
//        treeResource.city.get should equal("New York City")
//      }
//      "point to a specific state" in {
//        treeResource.state.get should equal("New York")
//      }
//      "point to a specific borough" in {
//        treeResource.borough.get should equal("Queens")
//      }

//      "point to a specific NTA" in {
//        treeResource.nta.get should equal("Forest Hills")
//      }
//
//      "point to a specific block" in {
//        treeResource.block.get should equal("348711")
//      }
    }

    val treeRead = Rdf.read[Tree](treeResource)
    val state = Rdf.read[State](stateResource)
    val city = Rdf.read[City](cityResource)
    val borough = Rdf.read[Borough](boroughResource)
    val nta = Rdf.read[Nta](ntaResource)
    val block = Rdf.read[Block](blockResource)

    "a tree derived from a resource" should {
      "have a specific ID" in {
        treeRead.id should equal(180683)
      }

      "point to specific city" in {
        TreeTestData.city.name should equal("New York City")
      }

      "point to a specific state" in {
        TreeTestData.state.name should equal("New York")
      }

      "point to a specific borough" in {
        borough.name should equal("Queens")
      }

      "point to a specific NTA" in {
        nta.name should equal("Forest Hills")
      }

      "point to a specific block" in {
        block.id should equal(348711)
      }
    }

    "a city resource derived from a tree" should {
      "have a specific feature label" in {
        cityFeatureResource.label.get should equal("New York")
      }
      "have a geometry" in {
        cityFeatureResource.hasDefaultGeometry.get should equal(Uri.parse("urn:treedata:resource:geometry:New_York"))
      }
    }

    "a nta resource derived from a tree" should {
      "have a specific feature label" in {
        ntaFeatureResource.label.get should equal("Forest Hills")
      }
      "have a geometry" in {
        ntaFeatureResource.hasDefaultGeometry.get should equal(Uri.parse("urn:treedata:resource:geometry:Forest_Hills"))
      }
    }

    "a block resource derived from a tree" should {
      "have a specific feature label" in {
        blockFeatureResource.label.get should equal("348711")
      }
      "have a geometry" in {
        blockFeatureResource.hasDefaultGeometry.get should equal(Uri.parse("urn:treedata:resource:geometry:348711"))
      }
    }

    "a borough resource derived from a tree" should {
      "have a specific feature label" in {
        boroughFeatureResource.label.get should equal("Queens")
      }
      "have a geometry" in {
        boroughFeatureResource.hasDefaultGeometry.get should equal(Uri.parse("urn:treedata:resource:geometry:Queens"))
      }
    }

    "a read from a state resource" should {
      "have a specific state name" in {
        state.name should equal("New York")
      }

      "have a specific list of cities" in {
        state.cities.contains(Uri.parse("urn:treedata:resource:city:New York City"))
      }
    }

    "a read from a city resource" should {
      "have a specific city name" in {
        city.name should equal("New York City")
      }

      "have 4 boroughs" in {
        city.boroughs.size should equal(4)
      }

      "have a specific list of boroughs" in {
        assert(city.boroughs.contains(Uri.parse("urn:treedata:resource:borough:1")))
      }

      "have 8 postcodes" in {
        city.postcodes.size should equal(8)
      }

      "have a specific list of postcodes" in {
        assert(city.postcodes.contains(Uri.parse("urn:treedata:resource:postcode:11375")))
      }

      "have a specific state it resides in" in {
        city.state.toString should equal("urn:treedata:resource:state:New_York")
      }
    }

    "a read from a borough resource" should {
      "have a specific borough identifier" in {
        borough.name should equal("Queens")
        borough.borocode should equal(4)
      }

      "have 2 NTAs" in {
        borough.ntaList.size should equal(2)
      }

      "have a specific list of NTAs" in {
        assert(borough.ntaList.contains(Uri.parse("urn:treedata:resource:NTA:QN17")))
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
        nta.postCode.toString should equal("urn:treedata:resource:postcode:11375")
      }
    }

    "a read from a block resource" should {
      "have a specific block id" in {
        block.id should equal(348711)
      }

      "have a specific NTA" in {
        block.nta.toString should equal("urn:treedata:resource:NTA:QN17")
      }
    }
  }
}
