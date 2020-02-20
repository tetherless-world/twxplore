package io.github.tetherlessworld.twxplore.lib.tree
import java.io.{BufferedWriter, File, FileWriter}

import io.github.tetherlessworld.scena.{Rdf, RdfWriter}
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import org.apache.jena.rdf.model.ModelFactory

final class FileTreeCsvTransformerSink extends TreeCsvTransformerSink {
  override def accept(block: Block): Unit = accept("block-" + block.id, block)
  override def accept(borough: Borough): Unit = accept("borough-" + borough.borocode, borough)
  override def accept(censusTract: CensusTract): Unit = accept("censusTract-" + censusTract.id, censusTract)
  override def accept(city: City): Unit = accept("city-" + city.name, city)
  override def accept(nta: Nta): Unit = accept("nta-" + nta.nta, nta)
  override def accept(postcode: Postcode): Unit = accept("postcode-" + postcode.code, postcode)
  override def accept(species: TreeSpecies): Unit = accept("species-" + species.common, species)
  override def accept(state: State): Unit = accept("state-" + state.name, state)
  override def accept(tree: Tree): Unit = accept("tree-" + tree.id, tree)
  override def accept(zipCity: ZipCity): Unit = accept("zipCity-" + zipCity.city, zipCity)

  private def accept[T](fileBaseName: String, value: T)(implicit writer: RdfWriter[T]): Unit = {
    val file = new File(s"./testdata/${fileBaseName.replace(" ", "_")}.ttl")
    if(!file.exists()) {
      file.createNewFile()
    }

    val model = ModelFactory.createDefaultModel()
    Rdf.write(model, value)

    val fileWriter = new BufferedWriter(new FileWriter(file))
    try {
      model.write(fileWriter, "TURTLE")
    } finally {
      fileWriter.close()
    }
  }
}
