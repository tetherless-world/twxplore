package edu.rpi.tw.twxplore.lib.base.models.domain

import org.apache.jena.rdf.model.{Property, RDFNode, Resource}

trait PropertySetters {
  protected def setProperty[RdfNodeT <: RDFNode](property: Property, values: List[RdfNodeT]): Unit = {
    resource.removeAll(property)
    for (value <- values) {
      resource.addProperty(property, value)
    }
  }

  protected val resource: Resource
}
