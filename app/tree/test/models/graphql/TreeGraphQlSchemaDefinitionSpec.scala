package models.graphql

import io.github.tetherlessworld.twxplore.lib.tree.TreeTestData
import io.github.tetherlessworld.twxplore.lib.tree.stores.{TestFeatureStore, TestHierarchyStore, TestTreeStore}
import org.scalatestplus.play.PlaySpec
import play.api.libs.json.{JsObject, Json}
import play.api.test.FakeRequest
import sangria.ast.Document
import sangria.execution.Executor
import sangria.macros._
import sangria.marshalling.playJson._

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class TreeGraphQlSchemaDefinitionSpec extends PlaySpec {
  "GraphQL schema" must {

    //    "list trees" in {
    //      val query =
    //        graphql"""
    //         query TreesQuery {
    //           trees(limit: 10, offset: 0) {
    //               uri
    //           }
    //         }
    //       """
    //      executeQuery(query) must be(Json.parse(
    //        s"""
    //           |{"data":{"trees":[${TestData.treeList.map(tree => "{\"uri\":" + "\"" + tree.uri + "\"").mkString("},")}}]}}
    //           |""".stripMargin))
    //    }
    "list of nta give a borough" in {
      val query =
        graphql"""
           query TreesQuery($$borough: BoroughInput!) {
              ntas{
                byBorough(borough: $$borough) {
                  uri
                }
              }
           }
        """
      val result = executeQuery(query, vars = Json.obj("borough" -> Json.obj(
        "borocode" -> TreeTestData.boroughMap(1).borocode,
        "name" -> TreeTestData.boroughMap(1).name,
        "city" -> TreeTestData.boroughMap(1).city.toString,
        "ntaList" -> TreeTestData.boroughMap(1).ntaList.map(nta => nta.toString).toList,
        "uri" -> TreeTestData.boroughMap(1).uri.toString,
        "feature" -> TreeTestData.boroughMap(1).feature.toString
      )))
      result must be(Json.parse(
        s"""
           |{"data":{"ntas":{"byBorough":[${TreeTestData.boroughMap(1).ntaList.map(nta => "{\"uri\":" + "\"" + nta + "\"").mkString("},")}}]}}}
           |""".stripMargin
      ))
    }
    "list of block given a nta" in {
      val query =
        graphql"""
           query TreesQuery($$nta: NtaInput!) {
              blocks{
                byNta(nta: $$nta) {
                  uri
                }
              }
           }
        """
      val result = executeQuery(query, vars = Json.obj("nta" -> Json.obj(
        "nta" -> TreeTestData.ntaMap("MN14").nta,
        "name" -> TreeTestData.ntaMap("MN14").name,
        "blocks" -> TreeTestData.ntaMap("MN14").blocks.map(block => block.toString).toList,
        "borough" -> TreeTestData.ntaMap("MN14").borough.toString,
        "feature" -> TreeTestData.ntaMap("MN14").feature.toString,
        "postCode" -> TreeTestData.ntaMap("MN14").postCode.toString,
        "uri" -> TreeTestData.ntaMap("MN14").uri.toString
      )))
      result must be(Json.parse(
        s"""
           |{"data":{"blocks":{"byNta":[${TreeTestData.ntaMap("MN14").blocks.map(block => "{\"uri\":" + "\"" + block + "\"").mkString("},")}}]}}}
           |""".stripMargin
      ))
    }
    "list of boroughs given a city" in {
      val query =
        graphql"""
           query TreesQuery($$city: CityInput!) {
              boroughs{
                byCity(city: $$city) {
                  uri
                }
              }
           }
        """
      val result = executeQuery(query, vars = Json.obj("city" -> Json.obj(
        "name" -> TreeTestData.city.name,
        "boroughs" -> TreeTestData.city.boroughs.map(borough => borough.toString).toList,
        "postcodes" -> TreeTestData.city.postcodes.map(postcode => postcode.toString).toList,
        "state" -> TreeTestData.city.state.toString,
        "feature" -> TreeTestData.city.feature.toString,
        "uri" -> TreeTestData.city.uri.toString,
      )))
      result must be(Json.parse(
        s"""
           |{"data":{"boroughs":{"byCity":[${TreeTestData.city.boroughs.map(borough => "{\"uri\":" + "\"" + borough + "\"").mkString("},")}}]}}}
           |""".stripMargin
      ))
    }
    "return a geometry given a city" in {
      val query =
        graphql"""
           query TreesQuery($$cityUri: String!) {
              city(uri: $$cityUri){
                geometry{
                  uri
                }
              }
           }
        """
      val result = executeQuery(query, vars = Json.obj(
        "cityUri" -> TreeTestData.city.uri.toString,
      ))
      result must be(Json.parse(
        s"""
           |{"data":{"city": {"geometry": { "uri": "http://example.com/geometry" }}}}
           |""".stripMargin
      ))
    }
    "return a geometry given a list of boroughs" in {
      val query =
        graphql"""
           query TreesQuery($$boroughUri: String!) {
              borough(uri: $$boroughUri) {
                geometry{
                  uri
                }
              }
           }
        """
      val result = executeQuery(query, vars = Json.obj(
        "boroughUri" -> TreeTestData.boroughMap(1).uri.toString,
      ))
      result must be(Json.parse(
        s"""
           |{"data":{"borough": {"geometry": { "uri": "http://example.com/geometry" }}}}
           |""".stripMargin
      ))
    }
    "return a geometry given a list of ntas" in {
      val query =
        graphql"""
           query TreesQuery($$ntaUri: String!) {
              nta(uri: $$ntaUri) {
                geometry{
                  uri
                }
              }
           }
        """
      val result = executeQuery(query, vars = Json.obj(
        "ntaUri" -> TreeTestData.ntaMap("MN14").uri.toString
      ))
      result must be(Json.parse(
        s"""
           |{"data":{"nta": {"geometry": { "uri": "http://example.com/geometry" }}}}
           |""".stripMargin
      ))
    }
    "return a geometry given a list of blocks" in {
      val query =
        graphql"""
           query TreesQuery($$blockUri: String!) {
              block(uri: $$blockUri){
                geometry {
                  uri
                }
              }
           }
        """
      val result = executeQuery(query, vars = Json.obj(
        "blockUri" -> TreeTestData.blockMap(348711).uri.toString,
      ))
      result must be(Json.parse(
        s"""
           |{"data":{"block":{"geometry": { "uri": "http://example.com/geometry" }}}}
           |""".stripMargin
      ))
    }
  }

  def executeQuery(query: Document, vars: JsObject = Json.obj()) = {
    val futureResult = Executor.execute(TreeGraphQlSchemaDefinition.schema, query,
      variables = vars,
      userContext = new TreeGraphQlSchemaContext(featureStore = TestFeatureStore, hierarchyStore = TestHierarchyStore, request = FakeRequest(), treeStore = TestTreeStore)
    )
    Await.result(futureResult, 10.seconds)
  }
}
