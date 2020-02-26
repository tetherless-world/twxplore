package io.github.tetherlessworld.twxplore.lib.tree.etl

import java.util

import com.google.common.collect.ImmutableList
import edu.rpi.tw.twks.api.TwksClient
import edu.rpi.tw.twks.nanopub.Nanopublication
import io.github.tetherlessworld.scena.{Rdf, RdfWriter}

abstract class AbstractTwksTransformerSink(twksClient: TwksClient) extends TransformerSink {
  private val nanopublicationsBuffer = new util.ArrayList[Nanopublication]()

  protected final def accept[T](value: T)(implicit writer: RdfWriter[T]): Unit = {
    val nanopublicationBuilder = Nanopublication.builder()
    Rdf.write(nanopublicationBuilder.getAssertionBuilder.getModel, value)
    val nanopublication = nanopublicationBuilder.build()

    nanopublicationsBuffer.add(nanopublication)
  }

  override final def flush(): Unit = {
    if (!nanopublicationsBuffer.isEmpty) {
      val nanopublications = ImmutableList.copyOf[Nanopublication](nanopublicationsBuffer)
      twksClient.postNanopublications(nanopublications)
      nanopublicationsBuffer.clear()
    }
  }
}
