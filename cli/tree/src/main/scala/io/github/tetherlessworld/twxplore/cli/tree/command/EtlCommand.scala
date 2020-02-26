package io.github.tetherlessworld.twxplore.cli.tree.command

import com.beust.jcommander.{Parameter, Parameters}
import com.typesafe.scalalogging.Logger
import edu.rpi.tw.twks.client.direct.DirectTwksClient
import edu.rpi.tw.twks.factory.{TwksFactory, TwksFactoryConfiguration}
import io.github.tetherlessworld.twxplore.lib.tree.etl.geo._
import io.github.tetherlessworld.twxplore.lib.tree.etl.tree.{TreeCsvTransformer, TwksTreeCsvTransformerSink}
import io.github.tetherlessworld.twxplore.lib.tree.stores.TwksStore

object EtlCommand extends Command {

  val args = new Args()
  val name = "etl"
  private val logger = Logger(getClass.getName)

  def apply(): Unit = {
    val twksClient = new DirectTwksClient(TwksFactory.getInstance().createTwks(TwksFactoryConfiguration.builder().setFromEnvironment().build()))
    val twksStore = new TwksStore(twksClient)

    if (twksStore.getTrees(1, 0).isEmpty || true) {
      new TreeCsvTransformer(treeBufferSize = args.treeBufferSize).parseCsv(args.csvFilePath, new TwksTreeCsvTransformerSink(twksClient))
      new CityCsvTransformer().parseCsv("city.csv", new TwksGeometryCsvTransformerSink(twksClient))
      new BoroughCsvTransformer().parseCsv("nybb.csv", new TwksGeometryCsvTransformerSink(twksClient))
      new NtaCsvTransformer().parseCsv("test_ntadata.csv", new TwksGeometryCsvTransformerSink(twksClient))
      new BlockCsvTransformer().parseCsv("test_blockdata.csv", new TwksGeometryCsvTransformerSink(twksClient))
    }
  }

  @Parameters(commandDescription = "Run the extract-transform-load (ETL) pipeline")
  class Args {
    @Parameter(names = Array("--csv-file-path"), required = true)
    var csvFilePath: String = null
    @Parameter(names = Array("--tree-buffer-size"))
    var treeBufferSize: Int = TreeCsvTransformer.TreeBufferSizeDefault
  }

}
