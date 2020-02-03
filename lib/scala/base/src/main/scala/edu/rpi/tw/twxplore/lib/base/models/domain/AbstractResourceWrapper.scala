package edu.rpi.tw.twxplore.lib.base.models.domain

import edu.rpi.tw.twks.uri.Uri
import org.apache.jena.rdf.model.{Literal, Property, RDFNode, Resource}

import scala.collection.JavaConverters._

abstract class AbstractResourceWrapper(protected val resource: Resource) {
  protected final def getPropertyObject(property: Property): Option[RDFNode] =
    Option(resource.getProperty(property)).map(statement => statement.getObject)

  protected final def getPropertyObjects(property: Property): List[RDFNode] =
    resource.listProperties(property).asScala.toList.map(statement => statement.getObject)

  protected final def getPropertyObjectInt(property: Property): Option[Int] =
    getPropertyObjectLiteral(property).map(literal => literal.getInt)

  protected final def getPropertyObjectLiteral(property: Property): Option[Literal] =
    getPropertyObject(property).flatMap(object_ => if (object_.isLiteral) Some(object_.asLiteral()) else None)

  protected final def getPropertyObjectLiterals(property: Property): List[Literal] =
    getPropertyObjects(property).flatMap(object_ => if (object_.isLiteral) Some(object_.asLiteral()) else None)

  protected final def getPropertyObjectString(property: Property): Option[String] =
    getPropertyObjectLiteral(property).map(literal => literal.getString)

  protected final def getPropertyObjectStrings(property: Property): List[String] =
    getPropertyObjectLiterals(property).map(literal => literal.getString)

  def uri: Uri = Uri.parse(resource.getURI)
}
