package models.graphql

import io.github.tetherlessworld.twxplore.lib.tree.stores.{LegacyStore, TreeStore}
import play.api.mvc.Request

final class GraphQlSchemaContext(request: Request[_], val legacyStore: LegacyStore, val treeStore: TreeStore) {
}
