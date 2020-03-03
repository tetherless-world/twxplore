package models.graphql

import play.api.mvc.Request
import stores.GeoStore

class GeoGraphQlSchemaContext(request: Request[_], val store: GeoStore) {
}
