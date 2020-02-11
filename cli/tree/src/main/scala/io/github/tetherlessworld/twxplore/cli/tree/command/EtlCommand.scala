package io.github.tetherlessworld.twxplore.cli.tree.command

import java.io.{File, FileWriter}
import java.nio.file.Paths

import com.beust.jcommander.{Parameter, Parameters}
import com.typesafe.scalalogging.Logger
import io.github.tetherlessworld.twxplore.lib.tree.{FileTreeCsvTransformerSink, TreeDataCsvTransformer}

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

    treeData.parseCsv(args.dataDirectoryPath, new FileTreeCsvTransformerSink)

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
  }

  private val logger = Logger(getClass.getName)
  val name = "etl"
}
