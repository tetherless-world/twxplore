package edu.rpi.tw.twxplore.lib.base.models.domain

import edu.rpi.tw.twks.uri.Uri
import org.apache.jena.rdf.model.{Literal, Property, RDFNode, Resource}

import scala.collection.JavaConverters._

abstract class AbstractResourceWrapper(protected val resource: Resource) {
  def getPropertyObject(property: Property): Option[RDFNode] =
    Option(resource.getProperty(property)).map(statement => statement.getObject)

  def getPropertyObjects(property: Property): List[RDFNode] =
    resource.listProperties(property).asScala.toList.map(statement => statement.getObject)

  def getPropertyObjectInt(property: Property): Option[Int] =
    getPropertyObjectLiteral(property).map(literal => literal.getInt)

  def getPropertyObjectLiteral(property: Property): Option[Literal] =
    getPropertyObject(property).flatMap(object_ => if (object_.isLiteral) Some(object_.asLiteral()) else None)

  def getPropertyObjectLiterals(property: Property): List[Literal] =
    getPropertyObjects(property).flatMap(object_ => if (object_.isLiteral) Some(object_.asLiteral()) else None)

  def getPropertyObjectString(property: Property): Option[String] =
    getPropertyObjectLiteral(property).map(literal => literal.getString)

  def getPropertyObjectStrings(property: Property): List[String] =
    getPropertyObjectLiterals(property).map(literal => literal.getString)

  def uri: Uri = Uri.parse(resource.getURI)
}
