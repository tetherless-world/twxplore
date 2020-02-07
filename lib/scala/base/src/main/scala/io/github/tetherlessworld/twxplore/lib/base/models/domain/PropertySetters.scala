package io.github.tetherlessworld.twxplore.lib.base.models.domain

import edu.rpi.tw.twks.uri.Uri
import org.apache.jena.rdf.model.{Property, RDFNode, Resource, ResourceFactory}

trait PropertySetters {
  protected def addProperty[RdfNodeT <: RDFNode](property: Property, values: List[RdfNodeT]): Unit = {
    for (value <- values) {
      resource.addProperty(property, value)
    }
  }

  protected def addPropertyLiteral[T](property: Property, value: T) = {
    addProperty(property, List(ResourceFactory.createPlainLiteral(value.toString)))
  }

  protected def addPropertyLiterals[T](property: Property, values: List[T]) = {
    addProperty(property, values.map(value => ResourceFactory.createPlainLiteral(value.toString)))
  }

  protected def addPropertyUris(property: Property, uris: List[Uri]) = {
    addProperty(property, uris.map(uri => {
      Option(resource.getModel.getResource(uri.toString))
        .getOrElse(ResourceFactory.createResource(uri.toString))
    }))
  }

  protected def addPropertyUri(property: Property, uri: Uri) = {
    addPropertyUris(property, List(uri))
  }

  protected def setProperty[RdfNodeT <: RDFNode](property: Property, values: List[RdfNodeT]): Unit = {
    resource.removeAll(property)
    for (value <- values) {
      resource.addProperty(property, value)
    }
  }

  protected def setPropertyUris(property: Property, uris: List[Uri]) = {
    setProperty(property, uris.map(uri => {
      Option(resource.getModel.getResource(uri.toString))
        .getOrElse(ResourceFactory.createResource(uri.toString))
    }))
  }

  protected def setPropertyUri(property: Property, uri: Uri) = {
    setPropertyUris(property, List(uri))
  }

//  protected def addPropertyLiteral[RdfNodeT <: RDFNode](property: Property, value: RdfNodeT) = {
//    addProperty(property, List(ResourceFactory.createPlainLiteral(value.toString)))
//  }

  protected def setPropertyLiteral[T](property: Property, value: T) = {
    addProperty(property, List(ResourceFactory.createPlainLiteral(value.toString)))
  }

//  protected def setPropertyLiteral[RdfNodeT <: RDFNode](property: Property, value: RdfNodeT) = {
//    setProperty(property, List(ResourceFactory.createPlainLiteral(value.toString)))
//  }

  protected val resource: Resource
}
