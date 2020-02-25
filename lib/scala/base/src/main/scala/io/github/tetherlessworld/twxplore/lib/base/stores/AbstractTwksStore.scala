package io.github.tetherlessworld.twxplore.lib.base.stores

import edu.rpi.tw.twks.api.TwksClient
import org.apache.jena.query.{Query, QueryExecution}
import play.api.Logging

abstract class AbstractTwksStore(protected val twksClient: TwksClient) extends Logging {
  protected final def withAssertionsQueryExecution[T](query: Query)(f: (QueryExecution) => T): T = {
    val queryExecution = twksClient.queryAssertions(query)
    try {
      f(queryExecution)
    } finally {
      queryExecution.close()
    }
  }
}
