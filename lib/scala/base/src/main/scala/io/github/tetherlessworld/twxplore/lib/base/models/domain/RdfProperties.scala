package io.github.tetherlessworld.twxplore.lib.base.models.domain

import org.apache.jena.rdf.model.Resource
import org.apache.jena.vocabulary.RDF

trait RdfProperties extends PropertyGetters with PropertySetters {
  /**
   * Get the first rdf:type of a resource.
   */
  final def `type` = types.headOption

  /**
   * Get all rdf:type's of a resource.
   */
  final def types = getPropertyObjectResources(RDF.`type`)

  /**
   * Set the rdf:type of of a resource, clearing out other types.
   */
  final def type_=(typeResource: Resource) =
    this.types_=(List(typeResource))

  /**
   * Set the rdf:types of a resource, clearing out other types.
   */
  final def types_=(typeResources: List[Resource]): Unit = {
    setProperty(RDF.`type`, typeResources)
  }
}
