package io.github.tetherlessworld.twxplore.lib.base.stores

import edu.rpi.tw.twks.api.TwksClient
import edu.rpi.tw.twks.client.rest.{RestTwksClient, RestTwksClientConfiguration}
import org.apache.commons.configuration2.PropertiesConfiguration
import org.apache.jena.query.{Query, QueryExecution}
import play.api.{Configuration, Logging}

abstract class AbstractTwksStore(protected val twksClient: TwksClient) extends Logging {
  def this(configuration: Configuration) = this(AbstractTwksStore.createTwksClient(configuration))

  protected final def withAssertionsQueryExecution[T](query: Query)(f: (QueryExecution) => T): T = {
    val queryExecution = twksClient.queryAssertions(query)
    try {
      f(queryExecution)
    } finally {
      queryExecution.close()
    }
  }
}

object AbstractTwksStore {
  final def createTwksClient(configuration: Configuration): TwksClient = {
    val properties = new PropertiesConfiguration
    for (entry <- configuration.entrySet) {
      val value = entry._2.unwrapped()
      if (value.isInstanceOf[String]) {
        properties.setProperty(entry._1, value.asInstanceOf[String])
      }
    }

    new RestTwksClient(RestTwksClientConfiguration.builder().setFromEnvironment().set(properties).build())
  }
}
