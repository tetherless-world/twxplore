package edu.rpi.tw.twxplore.lib.base.models.domain

import org.apache.jena.rdf.model.Resource
import org.apache.jena.vocabulary.RDF

object RdfResourceWrapper {
  // implicit class must be defined in an object/trait/class
  // Put in an object so it can be imported as RdfResourceWrapper._
  implicit class Impl(resource: Resource) extends AbstractResourceWrapper(resource) {
    /**
     * Get the first rdf:type of a resource.
     */
    final def `type` = types.headOption

    /**
     * Get all rdf:type's of a resource.
     */
    final def types = getPropertyObjects(RDF.`type`).flatMap(node => if (node.isResource) Some(node.asResource()) else None)

    /**
     * Set the rdf:type of of a resource, clearing out other types.
     */
    final def type_=(typeResource: Resource) =
      this.types_=(List(typeResource))

    /**
     * Set the rdf:types of a resource, clearing out other types.
     */
    final def types_=(typeResources: List[Resource]): Unit = {
      resource.removeAll(RDF.`type`)
      typeResources.foreach(typeResource => resource.addProperty(RDF.`type`, typeResource))
    }
  }
}
