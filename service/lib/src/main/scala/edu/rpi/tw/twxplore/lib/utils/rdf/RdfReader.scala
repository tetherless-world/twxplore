package edu.rpi.tw.twxplore.lib.utils.rdf

import org.apache.jena.rdf.model.Resource

trait RdfReader[A] {
  def read(resource: Resource): A
}
