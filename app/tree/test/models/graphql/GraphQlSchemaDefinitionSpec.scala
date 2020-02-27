package models.graphql

import io.github.tetherlessworld.twxplore.lib.tree.TestData
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
              ntas{
                byBorough(borough: $$borough) {
                  uri
                }
              }
           }
        """
      val result = executeQuery(query, vars = Json.obj("borough" -> Json.obj(
        "borocode" -> TestData.boroughMap(1).borocode,
        "name" -> TestData.boroughMap(1).name,
        "city" -> TestData.boroughMap(1).city.toString,
        "ntaList" -> TestData.boroughMap(1).ntaList.map(nta => nta.toString).toList,
        "uri" -> TestData.boroughMap(1).uri.toString,
        "feature" -> TestData.boroughMap(1).feature.toString
      )))
      result must be(Json.parse(
        s"""
           |{"data":{"ntas":{"byBorough":[${TestData.boroughMap(1).ntaList.map(nta => "{\"uri\":" + "\"" + nta + "\"").mkString("},")}}]}}}
           |""".stripMargin
      ))
    }
    "list of block given a nta" in {
      val query =
        graphql"""
           query TreesQuery($$nta: NtaFieldsInput!) {
              blocks{
                byNta(nta: $$nta) {
                  uri
                }
              }
           }
        """
      val result = executeQuery(query, vars = Json.obj("nta" -> Json.obj(
        "nta" -> TestData.ntaMap("MN14").nta,
        "name" -> TestData.ntaMap("MN14").name,
        "blocks" -> TestData.ntaMap("MN14").blocks.map(block => block.toString).toList,
        "borough" -> TestData.ntaMap("MN14").borough.toString,
        "feature" -> TestData.ntaMap("MN14").feature.toString,
        "postCode" -> TestData.ntaMap("MN14").postCode.toString,
        "uri" -> TestData.ntaMap("MN14").uri.toString
      )))
      result must be(Json.parse(
        s"""
           |{"data":{"blocks":{"byNta":[${TestData.ntaMap("MN14").blocks.map(block => "{\"uri\":" + "\"" + block + "\"").mkString("},")}}]}}}
           |""".stripMargin
      ))
    }
    "list of boroughs given a city" in {
      val query =
        graphql"""
           query TreesQuery($$city: CityFieldsInput!) {
              boroughs{
                byCity(city: $$city) {
                  uri
                }
              }
           }
        """
      val result = executeQuery(query, vars = Json.obj("city" -> Json.obj(
        "name" -> TestData.city.name,
        "boroughs" -> TestData.city.boroughs.map(borough => borough.toString).toList,
        "postcodes" -> TestData.city.postcodes.map(postcode => postcode.toString).toList,
        "state" -> TestData.city.state.toString,
        "feature" -> TestData.city.feature.toString,
        "uri" -> TestData.city.uri.toString,
      )))
      result must be(Json.parse(
        s"""
           |{"data":{"boroughs":{"byCity":[${TestData.city.boroughs.map(borough => "{\"uri\":" + "\"" + borough + "\"").mkString("},")}}]}}}
           |""".stripMargin
      ))
    }
    "return a geometry given a city" in {
      val query =
        graphql"""
           query TreesQuery($$city: CityFieldsInput!) {
              cities{
                geometryOfCity(city: $$city) {
                  wkt
                }
              }
           }
        """
      val result = executeQuery(query, vars = Json.obj("city" -> Json.obj(
        "name" -> TestData.city.name,
        "boroughs" -> TestData.city.boroughs.map(borough => borough.toString).toList,
        "postcodes" -> TestData.city.postcodes.map(postcode => postcode.toString).toList,
        "state" -> TestData.city.state.toString,
        "feature" -> TestData.city.feature.toString,
        "uri" -> TestData.city.uri.toString,
      )))
      result must be(Json.parse(
        s"""
           |{"data":{"cities": {"geometryOfCity": { "wkt": "${TestData.cityGeoMap("New York").geometry.wkt}" }}}}
           |""".stripMargin
      ))
    }
    "return a geometry given a list of boroughs" in {
      val query =
        graphql"""
           query TreesQuery($$boroughs: [BoroughFieldsInput!]!) {
              boroughs{
                geometryOfBoroughs(boroughs: $$boroughs) {
                  wkt
                }
              }
           }
        """
      val result = executeQuery(query, vars = Json.obj("boroughs" -> Json.arr(
        Json.obj(
          "borocode" -> TestData.boroughMap(1).borocode,
          "name" -> TestData.boroughMap(1).name,
          "city" -> TestData.boroughMap(1).city.toString,
          "ntaList" -> TestData.boroughMap(1).ntaList.map(nta => nta.toString).toList,
          "uri" -> TestData.boroughMap(1).uri.toString,
          "feature" -> TestData.boroughMap(1).feature.toString
        ))))
      result must be(Json.parse(
        s"""
           |{"data":{"boroughs": {"geometryOfBoroughs": [{ "wkt": "${TestData.boroughGeoMap("Manhattan").geometry.wkt}" }]}}}
           |""".stripMargin
      ))
    }
    "return a geometry given a list of ntas" in {
      val query =
        graphql"""
           query TreesQuery($$ntas: [NtaFieldsInput!]!) {
              ntas{
                geometryOfNtas(ntas: $$ntas) {
                  wkt
                }
              }
           }
        """
      val result = executeQuery(query, vars = Json.obj("ntas" -> Json.arr(Json.obj(
        "nta" -> TestData.ntaMap("MN14").nta,
        "name" -> TestData.ntaMap("MN14").name,
        "blocks" -> TestData.ntaMap("MN14").blocks.map(block => block.toString).toList,
        "borough" -> TestData.ntaMap("MN14").borough.toString,
        "feature" -> TestData.ntaMap("MN14").feature.toString,
        "postCode" -> TestData.ntaMap("MN14").postCode.toString,
        "uri" -> TestData.ntaMap("MN14").uri.toString
      ))))
      result must be(Json.parse(
        s"""
           |{"data":{"ntas": {"geometryOfNtas": [{ "wkt": "${TestData.ntaGeoMap("Lincoln Square").geometry.wkt}" }]}}}
           |""".stripMargin
      ))
    }
    "return a geometry given a list of blocks" in {
      val query =
        graphql"""
           query TreesQuery($$blocks: [BlockFieldsInput!]!) {
              blocks{
                geometryOfBlocks(blocks: $$blocks) {
                  wkt
                }
              }
           }
        """
      val result = executeQuery(query, vars = Json.obj("blocks" -> Json.arr(Json.obj(
        "id" -> TestData.blockMap(348711).id,
        "name" -> TestData.blockMap(348711).name,
        "nta" -> TestData.blockMap(348711).nta.toString,
        "feature" -> TestData.blockMap(348711).feature.toString,
        "uri" -> TestData.blockMap(348711).uri.toString,
      ))))
      result must be(Json.parse(
        s"""
           |{"data":{"blocks":{"geometryOfBlocks": [{ "wkt": "${TestData.blockGeoMap("348711").geometry.wkt}" }]}}}
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
