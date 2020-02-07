package io.github.tetherlessworld.twxplore.cli.tree.command

import java.io.{File, FileWriter}
import java.nio.file.Paths

import com.beust.jcommander.{Parameter, Parameters}
import com.typesafe.scalalogging.Logger
import io.github.tetherlessworld.scena.Rdf
import io.github.tetherlessworld.twxplore.lib.geo.models.domain._
import io.github.tetherlessworld.twxplore.lib.tree.TreeDataCsvTransformer
import org.apache.jena.rdf.model.ModelFactory

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
    treeData.parseCSV(args.dataDirectoryPath)
    val model = ModelFactory.createDefaultModel()
    for(tree <- treeData.treeList){
      Rdf.write[Tree](model, tree)
    }
    val file = new File(args.pipelineName)
    println(args.pipelineName)
    val fileWriter = new FileWriter(file)

    try {
      model.write(fileWriter, "TURTLE")
    } finally {
      fileWriter.close()
    }
//    val pipeline = Pipelines.pipelines.get(pipelineName)
//    if (!pipeline.isDefined) {
//      logger.error(s"no such pipeline `${pipelineName}`, valid: ${Pipelines.pipelines.keySet.mkString(" ")}")
//      return
//    }
//
//    val model = ModelFactory.createDefaultModel()
//
//    val dataDirectoryPath = Paths.get(args.dataDirectoryPath)
//
//    val extractedDataDirectoryPath = dataDirectoryPath.resolve("extracted").resolve(pipelineName)
//    Files.createDirectories(extractedDataDirectoryPath)
//
//    pipeline.get.extractor.extract(extractedDataDirectoryPath)
//
//    val transformedDataDirectoryPath = dataDirectoryPath.resolve("transformed").resolve(pipelineName)
//    Files.createDirectories(transformedDataDirectoryPath)
//    val transformedFilePath = transformedDataDirectoryPath.resolve(pipelineName + ".ttl")
//
//    for (thing <- pipeline.get.transformer.transform(extractedDataDirectoryPath)) {
//      thing.toResource(model)
//    }
//
//    val fileWriter = new FileWriter(transformedFilePath.toFile)
//    try {
//      model.write(fileWriter, "TURTLE")
//    } finally {
//      fileWriter.close()
//    }
  }

  private val logger = Logger(getClass.getName)
  val name = "etl"
}
