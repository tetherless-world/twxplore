package io.github.tetherlessworld.twxplore.lib.geo.models.graphql

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.Geometry
import sangria.marshalling.{CoercedScalaResultMarshaller, FromInput}

object GeometryToGraphQl {
  implicit val geometry = new FromInput[Geometry] {
    val marshaller = CoercedScalaResultMarshaller.default

    def fromResult(node: marshaller.Node) = {
      val ad = node.asInstanceOf[Map[String, Any]]

      Geometry(
        label = ad("label").asInstanceOf[Option[String]],
        uri = ad("uri").asInstanceOf[Uri],
          wkt = ad("wkt").asInstanceOf[String]
      )
    }
  }
}
