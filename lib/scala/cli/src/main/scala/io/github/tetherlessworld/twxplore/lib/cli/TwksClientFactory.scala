package io.github.tetherlessworld.twxplore.lib.cli

import edu.rpi.tw.twks.api.TwksClient
import edu.rpi.tw.twks.client.direct.DirectTwksClient
import edu.rpi.tw.twks.client.rest.{RestTwksClient, RestTwksClientConfiguration}
import edu.rpi.tw.twks.factory.{TwksFactory, TwksFactoryConfiguration}

object TwksClientFactory {
  def createDirectTwksClient(): TwksClient =
    new DirectTwksClient(TwksFactory.getInstance().createTwks(TwksFactoryConfiguration.builder().setFromEnvironment().build()))

  def createRestTwksClient(): TwksClient =
    new RestTwksClient(RestTwksClientConfiguration.builder().setFromEnvironment().build())
}
