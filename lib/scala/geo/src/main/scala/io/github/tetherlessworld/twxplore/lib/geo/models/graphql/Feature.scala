package io.github.tetherlessworld.twxplore.lib.geo.models.graphql

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.{Feature, Geometry}
import sangria.marshalling.{CoercedScalaResultMarshaller, FromInput}

object FeatureToGraphQl {
  implicit val feature = new FromInput[Feature] {
    val marshaller = CoercedScalaResultMarshaller.default

    def fromResult(node: marshaller.Node) = {
      val ad = node.asInstanceOf[Map[String, Any]]

      Feature(
        geometry = ad("geometry").asInstanceOf[Geometry],
        label = ad("label").asInstanceOf[Option[String]],
        uri = ad("uri").asInstanceOf[Uri]
      )
    }
  }
}

