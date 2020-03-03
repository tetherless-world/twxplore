package models.graphql

import io.github.tetherlessworld.twxplore.lib.geo.GeoTestData
import org.scalatestplus.play.PlaySpec
import play.api.libs.json.{JsObject, Json}
import play.api.test.FakeRequest
import sangria.ast.Document
import sangria.execution.Executor
import sangria.macros._
import sangria.marshalling.playJson._
import stores.TestGeoStore

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class GeoGraphQlSchemaDefinitionSpec extends PlaySpec {
  "GraphQL schema" must {

    "list features" in {
      val query =
        graphql"""
         query FeaturesQuery {
           features(limit: 10, offset: 0) {
               uri
           }
         }
       """
      executeQuery(query) must be(Json.parse(
        s"""
           |{"data":{"features":[{"uri":"${GeoTestData.feature.uri.toString()}"}]}}
           |""".stripMargin))
    }

    "get feature by uri" in {
      val query =
        graphql"""
         query FeaturesQuery($$uri: String!) {
           featureByUri(uri: $$uri) {
               uri
           }
         }
       """
      executeQuery(query, vars = Json.obj("uri" -> GeoTestData.feature.uri.toString)) must be(Json.parse(
        s"""
           |{"data":{"featureByUri":{"uri":"${GeoTestData.feature.uri.toString()}"}}}
           |""".stripMargin))
    }

    "get features by geometry" in {
      val query =
        graphql"""
          query FeaturesQuery($$geometry: GeometryInput!) {
            featuresContaining(geometry: $$geometry) {
              uri
            }
          }
        """
      val result = executeQuery(query, vars = Json.obj("geometry" -> Json.obj("wkt" -> GeoTestData.geometry.wkt, "uri" -> GeoTestData.geometry.uri.toString, "label" -> GeoTestData.geometry.label)))
        result must be(Json.parse(
          s"""
             |{"data":{"featuresContaining":[{"uri":"${GeoTestData.feature.uri.toString()}"}]}}
             |""".stripMargin))
    }
  }

  def executeQuery(query: Document, vars: JsObject = Json.obj()) = {
    val futureResult = Executor.execute(GeoGraphQlSchemaDefinition.schema, query,
      variables = vars,
      userContext = new GeoGraphQlSchemaContext(FakeRequest(), TestGeoStore)
    )
    Await.result(futureResult, 10.seconds)
}}
