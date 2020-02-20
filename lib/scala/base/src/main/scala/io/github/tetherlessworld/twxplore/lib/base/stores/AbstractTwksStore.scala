package io.github.tetherlessworld.twxplore.lib.base.stores

import edu.rpi.tw.twks.client.RestTwksClient
import org.apache.jena.query.{Query, QueryExecution}
import play.api.Logging

abstract class AbstractTwksStore(configuration: TwksStoreConfiguration) extends Logging {
  protected val twksClient = new RestTwksClient(configuration.twksClientConfiguration)

  protected final def withAssertionsQueryExecution[T](query: Query)(f: (QueryExecution) => T): T = {
    val queryExecution = twksClient.queryAssertions(query)
    try {
      f(queryExecution)
    } finally {
      queryExecution.close()
    }
  }
}
