package models.graphql

import play.api.mvc.Request
import stores.Store

class GraphQlSchemaContext(request: Request[_], val store: Store) {
}
