package io.github.tetherlessworld.twxplore.lib.tree

import java.io.{BufferedWriter, File, FileWriter}

import io.github.tetherlessworld.scena.Rdf
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import org.apache.jena.rdf.model.{Model, ModelFactory}

trait TreeCsvTransformerSink {
  private def writeModel(model: Model, filename: String): Unit = {
    val file = new File(s"./testdata/${filename.replace(" ", "_")}.ttl")
    if(!file.exists()) {
      file.createNewFile()
    }

    val fileWriter = new BufferedWriter(new FileWriter(file))

    try {
      model.write(fileWriter, "TURTLE")
    } finally {
      fileWriter.close()
    }
  }

  def accept(tree: Tree): Unit = {
    val model = ModelFactory.createDefaultModel()
    val filename = "tree-" + tree.id.toString
    Rdf.write[Tree](model, tree)
    writeModel(model, filename)
  }

  def accept(state: State): Unit = {
    val model = ModelFactory.createDefaultModel()
    val filename = "state-" + state.name
    Rdf.write[State](model, state)
    writeModel(model, filename)
  }

  def accept(city: City): Unit = {
    val model = ModelFactory.createDefaultModel()
    val filename = "city-" + city.name
    Rdf.write[City](model, city)
    writeModel(model, filename)
  }

  def accept(borough: Borough): Unit = {
    val model = ModelFactory.createDefaultModel()
    val filename = "borough-" + borough.name
    Rdf.write[Borough](model, borough)
    writeModel(model, filename)
  }

  def accept(nta: Nta): Unit = {
    val model = ModelFactory.createDefaultModel()
    val filename = "nta-" + nta.name
    Rdf.write[Nta](model, nta)
    writeModel(model, filename)
  }

  def accept(block: Block): Unit = {
    val model = ModelFactory.createDefaultModel()
    val filename = "block-" + block.id.toString
    Rdf.write[Block](model, block)
    writeModel(model, filename)
  }

  def accept(species: TreeSpecies): Unit = {
    val model = ModelFactory.createDefaultModel()
    val filename = "species-" + species.common
    Rdf.write[TreeSpecies](model, species)
    writeModel(model, filename)
  }

  def accept(postcode: Postcode): Unit = {
    val model = ModelFactory.createDefaultModel()
    val filename = "postcode-" + postcode.code.toString
    Rdf.write[Postcode](model, postcode)
    writeModel(model, filename)
  }

  def accept(zipCity: ZipCity): Unit = {
    val model = ModelFactory.createDefaultModel()
    val filename = "zipCity-" + zipCity.city
    Rdf.write[ZipCity](model, zipCity)
    writeModel(model, filename)
  }

  def accept(censusTract: CensusTract): Unit = {
    val model = ModelFactory.createDefaultModel()
    val filename = "censusTract-" + censusTract.id.toString
    Rdf.write[CensusTract](model, censusTract)
    writeModel(model, filename)
  }
}
