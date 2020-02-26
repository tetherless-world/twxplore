package io.github.tetherlessworld.twxplore.lib.base

import edu.rpi.tw.twks.api.TwksClient
import edu.rpi.tw.twks.client.direct.DirectTwksClient
import edu.rpi.tw.twks.factory.{TwksFactory, TwksFactoryConfiguration}
import org.apache.commons.configuration2.PropertiesConfiguration
import play.api.Configuration

object TwksClientFactory {
  def createTwksClient(): TwksClient =
    createTwksClient(TwksFactoryConfiguration.builder().setFromEnvironment().build())

  def createTwksClient(configuration: Configuration): TwksClient = {
    val properties = new PropertiesConfiguration
    for (entry <- configuration.entrySet) {
      val value = entry._2.unwrapped()
      if (value.isInstanceOf[String]) {
        properties.setProperty(entry._1, value.asInstanceOf[String])
      }
    }

    createTwksClient(TwksFactoryConfiguration.builder().set(properties).build())
  }

  def createTwksClient(twksFactoryConfiguration: TwksFactoryConfiguration): TwksClient =
    new DirectTwksClient(TwksFactory.getInstance().createTwks(twksFactoryConfiguration))
}
