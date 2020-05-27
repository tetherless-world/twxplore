package models.graphql

import models.GeoTestData
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

    "list all features with limit and offset" in {
      val query =
        graphql"""
         query FeaturesQuery {
           features(query: {}, limit: 10, offset: 0) {
               geometry {
                  parsedWkt {
                    ... on Point {
                      x
                      y
                    }
                    ... on Polygon {
                      lines
                    }
                  }
                  uri
               }
               regions
               uri
           }
         }
       """

      val results = Json.stringify(executeQuery(query))
      results must include(GeoTestData.feature.uri.toString)
      results must include(GeoTestData.containingFeature.uri.toString)
      results must include(GeoTestData.containedFeature.uri.toString)
      results must include(GeoTestData.feature.regions(0))
      results must include("4.3457")
    }

    "list all features without limit and offset" in {
      val query =
        graphql"""
         query FeaturesQuery {
           features(query: {}) {
               uri
           }
         }
       """

      val results = Json.stringify(executeQuery(query))
      results must include(GeoTestData.feature.uri.toString)
      results must include(GeoTestData.containingFeature.uri.toString)
      results must include(GeoTestData.containedFeature.uri.toString)
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
            features(query: {types: [$$type]}, limit: 10, offset: 0) {
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

  "get features by exact URI" in {
    val query =
      graphql"""
          query FeaturesByType($$uri: String!) {
            features(query: {onlyFeatureUri: $$uri}, limit: 10, offset: 0) {
              uri
            }
          }
        """
    val result = executeQuery(query, vars = Json.obj("uri" -> GeoTestData.feature.uri.toString))
    result must be(Json.parse(
      s"""
         |{"data":{"features":[{"uri":"${GeoTestData.feature.uri.toString()}"}]}}
         |""".stripMargin))
  }

  "get features within feature" in {
    val query =
      graphql"""
          query FeaturesByType($$withinFeatureUri: String!) {
            features(query: {withinFeatureUri: $$withinFeatureUri}, limit: 10, offset: 0) {
              uri
            }
          }
        """
    val result = Json.stringify(executeQuery(query, vars = Json.obj("withinFeatureUri" -> GeoTestData.feature.uri.toString)))
    result must include(GeoTestData.containedFeature.uri.toString)
  }

  def executeQuery(query: Document, vars: JsObject = Json.obj()) = {
    val futureResult = Executor.execute(GeoGraphQlSchemaDefinition.schema, query,
      variables = vars,
      userContext = new GeoGraphQlSchemaContext(FakeRequest(), new TwksGeoStore(TestTwks.twksClient))
    )
    Await.result(futureResult, 10.seconds)
}}
