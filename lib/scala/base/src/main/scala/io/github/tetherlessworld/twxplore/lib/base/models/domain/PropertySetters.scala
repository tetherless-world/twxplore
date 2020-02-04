package io.github.tetherlessworld.twxplore.lib.base.models.domain

import edu.rpi.tw.twks.uri.Uri
import org.apache.jena.rdf.model.{Property, RDFNode, Resource, ResourceFactory}

trait PropertySetters {
  protected def setProperty[RdfNodeT <: RDFNode](property: Property, values: List[RdfNodeT]): Unit = {
    resource.removeAll(property)
    for (value <- values) {
      resource.addProperty(property, value)
    }
  }

  protected def setPropertyUris(property: Property, uris: List[Uri]) = {
    setProperty(property, uris.map(uri => ResourceFactory.createResource(uri.toString)))
  }

  protected def setPropertyUri(property: Property, uri: Uri) = {
    setPropertyUris(property, List(uri))
  }


  protected def setPropertyLiteral[RdfNodeT <: RDFNode](property: Property, value: RdfNodeT) = {
    setProperty(property, List(ResourceFactory.createPlainLiteral(value.toString)))
  }

  protected val resource: Resource
}
