package models.graphql

import io.github.tetherlessworld.twxplore.lib.tree.stores.{FeatureStore, LegacyStore, TreeStore}
import play.api.mvc.Request

final class GraphQlSchemaContext(val featureStore: FeatureStore, val legacyStore: LegacyStore, request: Request[_], val treeStore: TreeStore) {
}
