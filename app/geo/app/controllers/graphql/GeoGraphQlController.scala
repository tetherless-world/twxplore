package controllers.graphql

import akka.actor.ActorSystem
import io.github.tetherlessworld.twxplore.lib.base.controllers.graphql.BaseGraphQlController
import javax.inject.{Inject, Singleton}
import models.graphql.{GeoGraphQlSchemaContext, GeoGraphQlSchemaDefinition}
import play.api.mvc.Request
import stores.GeoStore

@Singleton
class GeoGraphQlController @Inject()(store: GeoStore, system: ActorSystem) extends BaseGraphQlController[GeoGraphQlSchemaContext](GeoGraphQlSchemaDefinition.schema, system) {
  override protected def getContext(request: Request[_]): GeoGraphQlSchemaContext = new GeoGraphQlSchemaContext(request, store)
}
