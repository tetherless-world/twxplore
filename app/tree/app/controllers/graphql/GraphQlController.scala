package controllers.graphql

import akka.actor.ActorSystem
import io.github.tetherlessworld.twxplore.lib.base.controllers.graphql.AbstractGraphQlController
import io.github.tetherlessworld.twxplore.lib.tree.stores.{FeatureStore, LegacyStore, TreeStore}
import javax.inject.{Inject, Singleton}
import models.graphql.{GraphQlSchemaContext, GraphQlSchemaDefinition}
import play.api.mvc.Request

@Singleton
class GraphQlController @Inject()(featureStore: FeatureStore, legacyStore: LegacyStore, system: ActorSystem, treeStore: TreeStore) extends AbstractGraphQlController[GraphQlSchemaContext](GraphQlSchemaDefinition.schema, system) {
  override protected def getContext(request: Request[_]): GraphQlSchemaContext = new GraphQlSchemaContext(featureStore = featureStore, legacyStore = legacyStore, request = request, treeStore = treeStore)
}
