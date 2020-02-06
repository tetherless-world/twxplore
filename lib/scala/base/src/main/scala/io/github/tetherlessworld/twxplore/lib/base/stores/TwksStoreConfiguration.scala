package io.github.tetherlessworld.twxplore.lib.base.stores

import edu.rpi.tw.twks.client.RestTwksClientConfiguration
import javax.inject.Inject
import org.apache.commons.configuration2.PropertiesConfiguration
import play.api.Configuration

class TwksStoreConfiguration(val twksClientConfiguration: RestTwksClientConfiguration) {
  @Inject
  def this(configuration: Configuration) = this(TwksStoreConfiguration.toTwksClientConfiguration(configuration))
}

object TwksStoreConfiguration {
  private def toTwksClientConfiguration(configuration: Configuration): RestTwksClientConfiguration = {
    val properties = new PropertiesConfiguration
    for (entry <- configuration.entrySet) {
      val value = entry._2.unwrapped()
      if (value.isInstanceOf[String]) {
        properties.setProperty(entry._1, value.asInstanceOf[String])
      }
    }

    RestTwksClientConfiguration.builder().set(properties).build()
  }
}
