package controllers.graphql

import akka.actor.ActorSystem
import io.github.tetherlessworld.twxplore.lib.base.controllers.graphql.AbstractGraphQlController
import io.github.tetherlessworld.twxplore.lib.tree.stores.{LegacyStore, TreeStore}
import javax.inject.{Inject, Singleton}
import models.graphql.{GraphQlSchemaContext, GraphQlSchemaDefinition}
import play.api.mvc.Request

@Singleton
class GraphQlController @Inject()(legacyStore: LegacyStore, system: ActorSystem, treeStore: TreeStore) extends AbstractGraphQlController[GraphQlSchemaContext](GraphQlSchemaDefinition.schema, system) {
  override protected def getContext(request: Request[_]): GraphQlSchemaContext = new GraphQlSchemaContext(request, legacyStore, treeStore)
}
