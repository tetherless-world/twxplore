package models.graphql

import io.github.tetherlessworld.twxplore.lib.tree.stores.LegacyStore
import play.api.mvc.Request

final class GraphQlSchemaContext(request: Request[_], val store: LegacyStore) {
}
