package edu.rpi.tw.twxplore.lib.geo.models.domain

import io.github.tetherlessworld.scena.Rdf
import org.scalatest.{Matchers, WordSpec}

class FeatureSpec extends WordSpec with Matchers {
  "The Feature companion object" should {
    "serialize and deserialize Features" in {
      val expected = TestData.feature
      val actualResource = Rdf.write(expected)
      val actual = Rdf.read[Feature](actualResource)
      actual should equal(expected)
    }
  }
}
