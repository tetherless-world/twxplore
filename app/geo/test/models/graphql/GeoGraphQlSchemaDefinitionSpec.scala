package models.graphql

import io.github.tetherlessworld.twxplore.lib.geo.GeoTestData
import org.scalatestplus.play.PlaySpec
import play.api.libs.json.{JsObject, Json}
import play.api.test.FakeRequest
import sangria.ast.Document
import sangria.execution.Executor
import sangria.macros._
import sangria.marshalling.playJson._
import stores.{TestTwks, TwksGeoStore}

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class GeoGraphQlSchemaDefinitionSpec extends PlaySpec {
  "GraphQL schema" must {

    "list all features" in {
      val query =
        graphql"""
         query FeaturesQuery {
           features(query: {}, limit: 10, offset: 0) {
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
         query FeatureQuery($$uri: String!) {
           feature(uri: $$uri) {
               uri
           }
         }
       """
      executeQuery(query, vars = Json.obj("uri" -> GeoTestData.feature.uri.toString)) must be(Json.parse(
        s"""
           |{"data":{"feature":{"uri":"${GeoTestData.feature.uri.toString()}"}}}
           |""".stripMargin))
    }

    "get features by type" in {
      val query =
        graphql"""
          query FeaturesByType($$type: FeatureType!) {
            features(query: {type: $$type}, limit: 10, offset: 0) {
              uri
            }
          }
        """
      val result = executeQuery(query, vars = Json.obj("type" -> GeoTestData.feature.`type`.get.toString))
        result must be(Json.parse(
          s"""
             |{"data":{"features":[{"uri":"${GeoTestData.feature.uri.toString()}"}]}}
             |""".stripMargin))
    }
  }

  "get features within WKT" in {
    val query =
      graphql"""
          query FeaturesByType($$wkt: String!) {
            features(query: {withinWkt: $$wkt}, limit: 10, offset: 0) {
              uri
            }
          }
        """
    val result = executeQuery(query, vars = Json.obj("wkt" -> GeoTestData.geometry.wkt))
    result must be(Json.parse(
      s"""
         |{"data":{"features":[]}}
         |""".stripMargin))
  }



  def executeQuery(query: Document, vars: JsObject = Json.obj()) = {
    val futureResult = Executor.execute(GeoGraphQlSchemaDefinition.schema, query,
      variables = vars,
      userContext = new GeoGraphQlSchemaContext(FakeRequest(), new TwksGeoStore(TestTwks.twksClient))
    )
    Await.result(futureResult, 10.seconds)
}}
