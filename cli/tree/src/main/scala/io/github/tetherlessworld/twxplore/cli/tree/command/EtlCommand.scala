package io.github.tetherlessworld.twxplore.cli.tree.command

import java.nio.file.Paths

import com.beust.jcommander.{Parameter, Parameters}
import com.typesafe.scalalogging.Logger
import edu.rpi.tw.twks.client.RestTwksClientConfiguration
import io.github.tetherlessworld.twxplore.lib.base.stores.TwksStoreConfiguration
import io.github.tetherlessworld.twxplore.lib.tree.{TreeDataCsvTransformer, TwksTreeCsvTransformerSink}
import stores.TwksStore
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
    val twksStoreConfig = new TwksStoreConfiguration(RestTwksClientConfiguration.builder().setServerBaseUrl("http://twks-server:8080").build())
    val store =  new TwksStore(twksStoreConfig)

    if(store.getTrees(1, 0).isEmpty){
      TreeDataCsvTransformer().parseCsv(args.dataDirectoryPath, new TwksTreeCsvTransformerSink(twksStoreConfig))
    }
    //    val file = new File(args.pipelineName)
    //    println(args.pipelineName)
    //    val fileWriter = new FileWriter(file)
    //
    //    try {
    //      val fileList = new java.io.File("./testdata").listFiles
    //      for(file <- fileList){
    //        val fileReader = Source.fromFile(file)
    //        for(line <- fileReader) {
    //          fileWriter.write(line)
    //        }
    //        fileReader.close()
    //        file.delete()
    //      }
    //    } finally {
    //      fileWriter.close()
    //    }
    //  }

  }
  private val logger = Logger(getClass.getName)
  val name = "etl"
}
