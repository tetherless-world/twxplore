package io.github.tetherlessworld.twxplore.lib.tree.stores

import edu.rpi.tw.twks.client.direct.DirectTwksClient
import edu.rpi.tw.twks.mem.{MemTwks, MemTwksConfiguration}
import io.github.tetherlessworld.twxplore.lib.tree.etl.geo._
import io.github.tetherlessworld.twxplore.lib.tree.etl.tree.{TreeCsvTransformer, TwksTreeCsvTransformerSink}

object TestTwks {
  val twks = new MemTwks(MemTwksConfiguration.builder().build())
  val twksClient = new DirectTwksClient(twks)
  private val geometryCsvTransformerSink = new TwksGeometryCsvTransformerSink(twksClient)
  new TreeCsvTransformer().parseCsv("tree.csv", new TwksTreeCsvTransformerSink(twksClient))
  new CityCsvTransformer().parseCsv("city.csv", geometryCsvTransformerSink)
  new BoroughCsvTransformer().parseCsv("borough.csv", geometryCsvTransformerSink)
  new NtaCsvTransformer().parseCsv("nta.csv", geometryCsvTransformerSink)
  new BlockCsvTransformer().parseCsv("block.csv", geometryCsvTransformerSink)
}
