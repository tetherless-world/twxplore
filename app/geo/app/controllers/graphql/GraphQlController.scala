package controllers.graphql

import akka.actor.ActorSystem
import edu.rpi.tw.twxplore.lib.controllers.graphql.AbstractGraphQlController
import javax.inject.{Inject, Singleton}
import models.graphql.{GraphQlSchemaContext, GraphQlSchemaDefinition}
import play.api.mvc.Request
import stores.Store

@Singleton
class GraphQlController @Inject()(store: Store, system: ActorSystem) extends AbstractGraphQlController[GraphQlSchemaContext](GraphQlSchemaDefinition.schema, system) {
  override protected def getContext(request: Request[_]): GraphQlSchemaContext = new GraphQlSchemaContext(request, store)
}
