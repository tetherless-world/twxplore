package graphql


import io.github.tetherlessworld.twxplore.lib.tree.TestData
import models.graphql.{GraphQlSchemaContext, GraphQlSchemaDefinition}
import org.scalatestplus.play.PlaySpec
import play.api.libs.json.{JsObject, Json}
import play.api.test.FakeRequest
import sangria.ast.Document
import sangria.execution.Executor
import sangria.macros._
import sangria.marshalling.playJson._
import stores.TestStore

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class GraphQlSchemaDefinitionSpec extends PlaySpec {
  "GraphQL schema" must {

    "list trees" in {
      val query =
        graphql"""
         query TreesQuery {
           trees(limit: 10, offset: 0) {
               uri
           }
         }
       """
      executeQuery(query) must be(Json.parse(
        s"""
           |{"data":{"trees":[${TestData.treeList.map(tree => "{\"uri\":" + "\"" + tree.uri + "\"").mkString("},")}}]}}
           |""".stripMargin))
    }
    "list of nta give a borough" in {
      val query =
        graphql"""
           query TreesQuery($$borough: BoroughFieldsInput!) {
              getNtasByBorough(borough: $$borough) {
                uri
              }
           }
        """
      val result = executeQuery(query, vars = Json.obj("borough" -> Json.obj(
        "borocode" -> TestData.boroughMap(1).borocode,
        "name" -> TestData.boroughMap(1).name,
        "city" -> TestData.boroughMap(1).city.toString,
        "ntaList" -> TestData.boroughMap(1).ntaList.map(nta => nta.toString).toList,
        "uri" -> TestData.boroughMap(1).uri.toString )))
      result must be(Json.parse(
        s"""
           |{"data":{"getNtasByBorough":[${TestData.boroughMap(1).ntaList.map(nta => "{\"uri\":" + "\"" + nta + "\"").mkString("},")}}]}}
           |""".stripMargin
      ))
    }
  }
  def executeQuery(query: Document, vars: JsObject = Json.obj()) = {
    val futureResult = Executor.execute(GraphQlSchemaDefinition.schema, query,
      variables = vars,
      userContext = new GraphQlSchemaContext(FakeRequest(), TestStore)
    )
    Await.result(futureResult, 10.seconds)
  }
}
