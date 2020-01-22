package edu.rpi.tw.twxplore.lib.base.utils.rdf

import org.apache.jena.rdf.model.Resource

trait RdfWriter[A] {
  def write(value: A): Resource
}
