package edu.rpi.tw.twxplore.lib.utils.rdf

import org.apache.jena.rdf.model.Resource

object Rdf {
  def toRdf[A](value: A)(implicit w: RdfWriter[A]): Resource =
    w.write(value)
}
