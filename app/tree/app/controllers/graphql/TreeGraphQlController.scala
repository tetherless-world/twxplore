package controllers.graphql

import akka.actor.ActorSystem
import io.github.tetherlessworld.twxplore.lib.base.controllers.graphql.BaseGraphQlController
import io.github.tetherlessworld.twxplore.lib.tree.stores.{FeatureStore, HierarchyStore, TreeStore}
import javax.inject.{Inject, Singleton}
import models.graphql.{TreeGraphQlSchemaContext, TreeGraphQlSchemaDefinition}
import play.api.mvc.Request

@Singleton
class TreeGraphQlController @Inject()(featureStore: FeatureStore, hierarchyStore: HierarchyStore, system: ActorSystem, treeStore: TreeStore) extends BaseGraphQlController[TreeGraphQlSchemaContext](TreeGraphQlSchemaDefinition.schema, system) {
  override protected def getContext(request: Request[_]): TreeGraphQlSchemaContext = new TreeGraphQlSchemaContext(featureStore = featureStore, hierarchyStore = hierarchyStore, request = request, treeStore = treeStore)
}
