package stores

import com.google.inject.AbstractModule
import play.api.{Configuration, Environment}

class StoreModule(environment: Environment, configuration: Configuration) extends AbstractModule {
  override def configure(): Unit = {
    bind(classOf[Store]).toInstance(new TwksStore(configuration.get[String]("twksServerBaseUrl")))
  }
}
