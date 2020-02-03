package edu.rpi.tw.twxplore.lib.geo.models.domain

import io.github.tetherlessworld.scena.Rdf
import org.apache.jena.rdf.model.ModelFactory
import org.scalatest.{Matchers, WordSpec}

class FeatureSpec extends WordSpec with Matchers {
  "The Feature companion object" should {
    "serialize and deserialize Features" in {
      val expected = TestData.feature
      val jenaModel = ModelFactory.createDefaultModel()
      val jenaResource = Rdf.write(jenaModel, expected)
      val actual = Rdf.read[Feature](jenaResource)
      actual should equal(expected)
    }
  }
}
