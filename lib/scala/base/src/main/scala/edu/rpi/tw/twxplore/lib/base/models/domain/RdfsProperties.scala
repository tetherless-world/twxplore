package edu.rpi.tw.twxplore.lib.base.models.domain

import org.apache.jena.rdf.model.ResourceFactory
import org.apache.jena.vocabulary.RDFS

trait RdfsProperties extends PropertyGetters {
  /**
   * Get the first rdfs:label of a resource.
   */
  final def `label` = labels.headOption

  /**
   * Get all rdfs:label's of a resource.
   */
  final def labels = getPropertyObjectStrings(RDFS.label)

  /**
   * Set the rdfs:label of of a resource, clearing out other labels.
   */
  final def label_=(label: String) =
    this.labels = List(label)

  /**
   * Set the rdfs:labels of a resource, clearing out other labels.
   */
  final def labels_=(labels: List[String]): Unit = {
    resource.removeAll(RDFS.label)
    labels.foreach(label => resource.addProperty(RDFS.label, ResourceFactory.createPlainLiteral(label)))
  }
}
