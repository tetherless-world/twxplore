package models.graphql

import io.github.tetherlessworld.twxplore.lib.tree.stores.Store
import play.api.mvc.Request

class GraphQlSchemaContext(request: Request[_], val store: Store) {
}
