package io.github.tetherlessworld.twxplore.lib.tree

import io.github.tetherlessworld.twxplore.lib.geo.models.domain.{Block, Tree}

trait TreeCsvTransformerSink {
  def accept(block: Block): Unit

  def accept(tree: Tree): Unit;
}

//case class TreeCsvToDomainModel() extends TreeCsvTransformerSink {
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
//case class TreeCsvToRdf() extends TreeCsvTransformerSink {
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
//      case _: Block => "block-" + value.asInstanceOf[Block].id.toString
//      case _: Borough => "borough-" + value.asInstanceOf[Borough].name
//      case _: CensusTract => "censusTract-" + value.asInstanceOf[CensusTract].id.toString
//      case _: City => "city-" + value.asInstanceOf[City].name
//      case _: Nta => "Nta-" + value.asInstanceOf[Nta].name
//      case _: Postcode => "postcode-" + value.asInstanceOf[Postcode].code.toString
//      case _: State => "state-" + value.asInstanceOf[State].name
//      case _: Tree => "tree-" + value.asInstanceOf[Tree].id.toString
//      case _: TreeSpecies => "species-" + value.asInstanceOf[TreeSpecies].common
//      case _: ZipCity => "zipCity-" + value.asInstanceOf[ZipCity].city
//    }
//    value match {
//      case _: Block => Rdf.write[Block](model, value.asInstanceOf[Block])
//      case _: Borough => Rdf.write[Borough](model, value.asInstanceOf[Borough])
//      case _: CensusTract => Rdf.write[CensusTract](model, value.asInstanceOf[CensusTract])
//      case _: City => Rdf.write[City](model, value.asInstanceOf[City])
//      case _: Nta => Rdf.write[Nta](model, value.asInstanceOf[Nta])
//      case _: Postcode => Rdf.write[Postcode](model, value.asInstanceOf[Postcode])
//      case _: State => Rdf.write[State](model, value.asInstanceOf[State])
//      case _: Tree => Rdf.write[Tree](model, value.asInstanceOf[Tree])
//      case _: TreeSpecies => Rdf.write[TreeSpecies](model, value.asInstanceOf[TreeSpecies])
//      case _: ZipCity => Rdf.write[ZipCity](model, value.asInstanceOf[ZipCity])
//    }
//    writeModel(model, filename)
//  }
//}
