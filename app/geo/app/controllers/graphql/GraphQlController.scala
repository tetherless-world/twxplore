package controllers.graphql

import akka.actor.ActorSystem
import io.github.tetherlessworld.twxplore.lib.base.controllers.graphql.AbstractGraphQlController
import javax.inject.{Inject, Singleton}
import play.api.mvc.Request
import stores.Store

@Singleton
class GraphQlController @Inject()(store: Store, system: ActorSystem) extends AbstractGraphQlController[GraphQlSchemaContext](GraphQlSchemaDefinition.schema, system) {
  override protected def getContext(request: Request[_]): GraphQlSchemaContext = new GraphQlSchemaContext(request, store)
}
