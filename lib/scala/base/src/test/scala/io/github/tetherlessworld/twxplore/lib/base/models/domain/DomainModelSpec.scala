package io.github.tetherlessworld.twxplore.lib.base.models.domain

import io.github.tetherlessworld.scena.{Rdf, RdfReader, RdfWriter}
import org.apache.jena.rdf.model.ModelFactory
import org.scalatest.{Matchers, WordSpec}

class DomainModelSpec extends WordSpec with Matchers {
  protected def testSerialization[ModelT](model: ModelT)(implicit reader: RdfReader[ModelT], writer: RdfWriter[ModelT]): Unit = {
    val jenaModel = ModelFactory.createDefaultModel()
    val jenaResource = Rdf.write(jenaModel, model)
    val actual = Rdf.read[ModelT](jenaResource)
      actual should equal(model)
  }
}
