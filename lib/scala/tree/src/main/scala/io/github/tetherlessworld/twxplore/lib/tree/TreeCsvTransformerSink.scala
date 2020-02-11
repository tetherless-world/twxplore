package io.github.tetherlessworld.twxplore.lib.tree

import io.github.tetherlessworld.twxplore.lib.geo.models.domain._

trait TreeCsvTransformerSink {
  def accept(block: Block): Unit
  def accept(borough: Borough): Unit
  def accept(nta: Nta): Unit
  def accept(postcode: Postcode): Unit
  def accept(zipCity: ZipCity): Unit
  def accept(censusTract: CensusTract): Unit
  def accept(city: City): Unit
  def accept(state: State): Unit
  def accept (species: TreeSpecies): Unit
  def accept(tree: Tree): Unit
}

//class TreeCsvToDomainModel() extends TreeCsvTransformerSink {
//  var treeList: ListBuffer[Tree] = new ListBuffer[Tree]()
//  var treeSpeciesMap: mutable.HashMap[String, TreeSpecies] = new mutable.HashMap()
//  var boroughMap: mutable.HashMap[Int, Borough] = new mutable.HashMap()
//  var ntaMap: mutable.HashMap[String, Nta] = new mutable.HashMap()
//  var blockMap: mutable.HashMap[Int, Block] = new mutable.HashMap()
//  var postalCode: mutable.HashMap[Int, Postcode] = new mutable.HashMap()
//  var zipCityMap: mutable.HashMap[String, ZipCity] = new mutable.HashMap()
//  var censusTractMap: mutable.HashMap[Int, CensusTract] = new mutable.HashMap()
//  var city: City = _
//  var state: State = _
//  def accept[T](value: T): Unit = {
//    value match {
//      case _: Block => blockMap += (value.asInstanceOf[Block].id -> value.asInstanceOf[Block])
//      case _: Borough => boroughMap += (value.asInstanceOf[Borough].borocode -> value.asInstanceOf[Borough])
//      case _: CensusTract => censusTractMap += (value.asInstanceOf[CensusTract].id -> value.asInstanceOf[CensusTract])
//      case _: City => city = value.asInstanceOf[City]
//      case _: Nta => ntaMap += (value.asInstanceOf[Nta].nta -> value.asInstanceOf[Nta])
//      case _: Postcode => postalCode += (value.asInstanceOf[Postcode].code -> value.asInstanceOf[Postcode])
//      case _: State => state = value.asInstanceOf[State]
//      case _: Tree => treeList += value.asInstanceOf[Tree]
//      case _: TreeSpecies => treeSpeciesMap += (value.asInstanceOf[TreeSpecies].common -> value.asInstanceOf[TreeSpecies])
//      case _: ZipCity => zipCityMap += (value.asInstanceOf[ZipCity].city -> value.asInstanceOf[ZipCity])
//    }
//  }
//}
//
//class TreeCsvToRdf() extends TreeCsvTransformerSink {
//  private def writeModel(model: Model, filename: String): Unit = {
//    val file = new File(s"./testdata/${filename.replace(" ", "_")}.ttl")
//    if(!file.exists()) {
//      file.createNewFile()
//    }
//
//    val fileWriter = new BufferedWriter(new FileWriter(file))
//
//    try {
//      model.write(fileWriter, "TURTLE")
//    } finally {
//      fileWriter.close()
//    }
//  }
//
//  def accept[T](value: T): Unit = {
//    val model = ModelFactory.createDefaultModel()
//    val filename = value match {
//      case value: Block => "block-" + value.id.toString
//      case value: Borough => "borough-" + value.name
//      case value: CensusTract => "censusTract-" + value.id.toString
//      case value: City => "city-" + value.name
//      case value: Nta => "Nta-" + value.name
//      case value: Postcode => "postcode-" + value.code.toString
//      case value: State => "state-" + value.name
//      case value: Tree => "tree-" + value.id.toString
//      case value: TreeSpecies => "species-" + value.common
//      case value: ZipCity => "zipCity-" + value.city
//    }
//    value match {
//      case value: Block => Rdf.write[Block](model, value)
//      case value: Borough => Rdf.write[Borough](model, value)
//      case value: CensusTract => Rdf.write[CensusTract](model, value)
//      case value: City => Rdf.write[City](model, value)
//      case value: Nta => Rdf.write[Nta](model, value)
//      case value: Postcode => Rdf.write[Postcode](model, value)
//      case value: State => Rdf.write[State](model, value)
//      case value: Tree => Rdf.write[Tree](model, value)
//      case value: TreeSpecies => Rdf.write[TreeSpecies](model, value)
//      case value: ZipCity => Rdf.write[ZipCity](model, value)
//    }
//    writeModel(model, filename)
//  }
//}
