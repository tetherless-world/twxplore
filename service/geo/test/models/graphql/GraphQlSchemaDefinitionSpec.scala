package models.graphql

import org.scalatestplus.play.PlaySpec
import play.api.libs.json.{JsArray, JsObject, Json}
import play.api.test.FakeRequest
import sangria.ast.Document
import sangria.execution.Executor
import sangria.macros._
import sangria.marshalling.playJson._
import stores.{TestData, TestStore}

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class GraphQlSchemaDefinitionSpec extends PlaySpec {
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
           |{"data":{"features":[{"uri":"${TestData.feature.uri.toString()}"}]}}
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
      executeQuery(query, vars = Json.obj("uri" -> TestData.feature.uri.toString)) must be(Json.parse(
        s"""
           |{"data":{"featureByUri":{"uri":"${TestData.feature.uri.toString()}"}}}
           |""".stripMargin))
    }

    "get features by geometry" in {
      val query =
        graphql"""
          query FeaturesQuery($$geometry: GeometryFieldsInput!) {
            featuresContaining(geometry: $$geometry) {
              uri
            }
          }
        """
        val result = executeQuery(query, vars = Json.obj("geometry" -> Json.obj("wkt" -> TestData.geometry.wkt, "uri" -> TestData.geometry.uri.toString, "label" -> TestData.geometry.label)))
        result must be(Json.parse(
          s"""
             |{"data":{"featuresContaining":[{"uri":"${TestData.feature.uri.toString()}"}]}}
             |""".stripMargin))
    }
  }

  def executeQuery(query: Document, vars: JsObject = Json.obj()) = {
    val futureResult = Executor.execute(GraphQlSchemaDefinition.schema, query,
      variables = vars,
      userContext = new GraphQlSchemaContext(FakeRequest(), TestStore)
    )
    Await.result(futureResult, 10.seconds)
}}
