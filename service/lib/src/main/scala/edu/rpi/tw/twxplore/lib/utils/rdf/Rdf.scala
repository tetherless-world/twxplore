package edu.rpi.tw.twxplore.lib.utils.rdf

import org.apache.jena.rdf.model.Resource

object Rdf {
  def read[A](resource: Resource)(implicit r: RdfReader[A]): A =
    r.read(resource)

  def write[A](value: A)(implicit w: RdfWriter[A]): Resource =
    w.write(value)
}
