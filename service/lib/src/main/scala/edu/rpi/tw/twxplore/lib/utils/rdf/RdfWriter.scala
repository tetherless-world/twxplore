package edu.rpi.tw.twxplore.lib.utils.rdf

import org.apache.jena.rdf.model.{Model, Resource, ResourceFactory}

trait RdfWriter[A] {
  def write(value: A): Resource
}
