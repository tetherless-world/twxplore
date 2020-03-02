package models.graphql

import io.github.tetherlessworld.twxplore.lib.tree.stores.{FeatureStore, HierarchyStore, TreeStore}
import play.api.mvc.Request

final class GraphQlSchemaContext(val featureStore: FeatureStore, val hierarchyStore: HierarchyStore, request: Request[_], val treeStore: TreeStore) {
}
