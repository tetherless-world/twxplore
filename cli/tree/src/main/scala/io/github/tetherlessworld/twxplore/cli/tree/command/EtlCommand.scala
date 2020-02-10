package io.github.tetherlessworld.twxplore.cli.tree.command

import java.io.{File, FileWriter}
import java.nio.file.Paths

import com.beust.jcommander.{Parameter, Parameters}
import com.typesafe.scalalogging.Logger
import io.github.tetherlessworld.twxplore.lib.tree.{TreeCsvTransformerSink, TreeDataCsvTransformer}
import org.apache.jena.rdf.model.ModelFactory

import scala.io.Source
object EtlCommand extends Command {

  @Parameters(commandDescription = "Run an extract-transform-load (ETL) pipeline")
  class Args {
    @Parameter(names = Array("-o", "--data-directory-path"))
    var dataDirectoryPath: String = "data"

    @Parameter(description = "pipeline name", required = true)
    var pipelineName: String = null
  }

  val args = new Args()

  def apply(): Unit = {
    val pipelineName = args.pipelineName.toLowerCase()
    val dataDirectoryPath = Paths.get(args.dataDirectoryPath)
    val treeData = TreeDataCsvTransformer()

    treeData.parseCsv(args.dataDirectoryPath, new TreeCsvTransformerSink {})
    val model = ModelFactory.createDefaultModel()
    var counter = 0
    var total_trees = treeData.treeList.size

    val file = new File(args.pipelineName)
    println(args.pipelineName)
    val fileWriter = new FileWriter(file)

    try {
      val fileList = new java.io.File("./testdata").listFiles
      for(file <- fileList){
        val fileReader = Source.fromFile(file)
        for(line <- fileReader) {
          fileWriter.write(line)
        }
        fileReader.close()
        file.delete()
      }
    } finally {
      fileWriter.close()
    }

//    println("Finished parsing the csv file: " + args.dataDirectoryPath)
//    breakable {
//    for(tree <- treeData.treeList){
//
//        counter += 1
//        if (counter % 100 == 0) {
//          println(s"${counter} trees processed: ${total_trees - counter} trees remaining")
//        }
//        if (counter > 100) {
//          break
//        }
//        Rdf.write[Tree](model, tree)
//      }
//    }
//    val file = new File(args.pipelineName)
//    println(args.pipelineName)
//    val fileWriter = new FileWriter(file)
//
//    try {
//      model.write(fileWriter, "TURTLE")
//    } finally {
//      fileWriter.close()
//    }
  }

  private val logger = Logger(getClass.getName)
  val name = "etl"
}
