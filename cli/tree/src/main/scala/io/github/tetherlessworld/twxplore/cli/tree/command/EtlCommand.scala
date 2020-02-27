package io.github.tetherlessworld.twxplore.cli.tree.command

import com.beust.jcommander.{Parameter, Parameters}
import com.typesafe.scalalogging.Logger
import edu.rpi.tw.twks.client.direct.DirectTwksClient
import edu.rpi.tw.twks.client.rest.{RestTwksClient, RestTwksClientConfiguration}
import edu.rpi.tw.twks.factory.{TwksFactory, TwksFactoryConfiguration}
import io.github.tetherlessworld.twxplore.lib.tree.etl.CsvTransformer
import io.github.tetherlessworld.twxplore.lib.tree.etl.geo._
import io.github.tetherlessworld.twxplore.lib.tree.etl.tree.{TreeCsvTransformer, TwksTreeCsvTransformerSink}
import io.github.tetherlessworld.twxplore.lib.tree.stores.TwksStore

object EtlCommand extends Command {

  val args = new Args()
  val name = "etl"
  private val logger = Logger(getClass.getName)

  def apply(): Unit = {
    val twksClient =
      if (args.direct)
        new DirectTwksClient(TwksFactory.getInstance().createTwks(TwksFactoryConfiguration.builder().setFromEnvironment().build()))
      else
        new RestTwksClient(RestTwksClientConfiguration.builder().setFromEnvironment().build())
    val twksStore = new TwksStore(twksClient)

    if (twksStore.getTrees(1, 0).isEmpty || true) {
      new CityCsvTransformer(bufferSize = args.bufferSize).parseCsv("city.csv", new TwksGeometryCsvTransformerSink(twksClient))
      new BoroughCsvTransformer(bufferSize = args.bufferSize).parseCsv("borough.csv", new TwksGeometryCsvTransformerSink(twksClient))
      new NtaCsvTransformer(bufferSize = args.bufferSize).parseCsv("nta.csv", new TwksGeometryCsvTransformerSink(twksClient))
      new BlockCsvTransformer(bufferSize = args.bufferSize).parseCsv("block.csv", new TwksGeometryCsvTransformerSink(twksClient))
      new TreeCsvTransformer(bufferSize = args.bufferSize).parseCsv("tree.csv", new TwksTreeCsvTransformerSink(twksClient))
    }
  }

  @Parameters(commandDescription = "Run the extract-transform-load (ETL) pipeline")
  class Args {
    @Parameter(names = Array("--direct"))
    var direct: Boolean = false
    @Parameter(names = Array("--buffer-size"))
    var bufferSize: Int = CsvTransformer.BufferSizeDefault
  }

}
