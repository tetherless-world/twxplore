package io.github.tetherlessworld.twxplore.cli.tree.command

import com.beust.jcommander.{Parameter, Parameters}
import com.typesafe.scalalogging.Logger
import edu.rpi.tw.twks.client.RestTwksClientConfiguration
import io.github.tetherlessworld.twxplore.lib.base.stores.TwksStoreConfiguration
import io.github.tetherlessworld.twxplore.lib.tree.geo._
import io.github.tetherlessworld.twxplore.lib.tree.stores.TwksStore
import io.github.tetherlessworld.twxplore.lib.tree.{TreeDataCsvTransformer, TwksTreeCsvTransformerSink}

object EtlCommand extends Command {

  val args = new Args()
  val name = "etl"
  private val logger = Logger(getClass.getName)

  def apply(): Unit = {
    val twksStoreConfig = new TwksStoreConfiguration(RestTwksClientConfiguration.builder().setServerBaseUrl("http://twks-server:8080").build())
    val store = new TwksStore(twksStoreConfig)

    if (store.getTrees(1, 0).isEmpty || true) {
      new TreeDataCsvTransformer().parseCsv(args.csvFilePath, new TwksTreeCsvTransformerSink(twksStoreConfig))
      new CityCsvTransformer().parseCsv("city.csv", new TwksGeometryCsvTransformerSink(twksStoreConfig))
      new BoroughCsvTransformer().parseCsv("nybb.csv", new TwksGeometryCsvTransformerSink(twksStoreConfig))
      new NtaCsvTransformer().parseCsv("test_ntadata.csv", new TwksGeometryCsvTransformerSink(twksStoreConfig))
      new BlockCsvTransformer().parseCsv("test_blockdata.csv", new TwksGeometryCsvTransformerSink(twksStoreConfig))
    }

  }

  @Parameters(commandDescription = "Run the extract-transform-load (ETL) pipeline")
  class Args {
    @Parameter(names = Array("--csv-file-path"), required = true)
    var csvFilePath: String = null
  }

}
