package io.github.tetherlessworld.twxplore.lib.base.models.domain

import java.util.Date

import edu.rpi.tw.twks.uri.Uri
import org.apache.jena.rdf.model.{Literal, Property, RDFNode, Resource}
import org.apache.jena.vocabulary._

import scala.collection.JavaConverters._

trait PropertyGetters {
  protected final def getPropertyObjectDate(property: Property): Option[Date] = {
    val dateFormatter = new java.text.SimpleDateFormat("EEE MMM dd hh:mm:ss zzz yyyy")
    getPropertyObjectString(property).map(date => dateFormatter.parse(date))
  }

  protected final def getPropertyObjectDates(property: Property): List[Date] = {
    val dateFormatter = new java.text.SimpleDateFormat("EEE MMM dd hh:mm:ss zzz yyyy")
    getPropertyObjectStrings(property).map(date => dateFormatter.parse(date))
  }

  protected final def getPropertyObject(property: Property): Option[RDFNode] =
    Option(resource.getProperty(property)).map(statement => statement.getObject)

  protected final def getPropertyObjects(property: Property): List[RDFNode] =
    resource.listProperties(property).asScala.toList.map(statement => statement.getObject)

  protected final def getPropertyObjectInt(property: Property): Option[Int] =
    getPropertyObjectLiteral(property).map(literal => literal.getInt)

  protected final def getPropertyObjectFloat(property: Property): Option[Float] =
    getPropertyObjectLiteral(property).map(literal => literal.getFloat)

  protected final def getPropertyObjectLong(property: Property): Option[Long] =
    getPropertyObjectLiteral(property).map(literal => literal.getLong)

  protected final def getPropertyObjectLiteral(property: Property): Option[Literal] =
    getPropertyObject(property).flatMap(object_ => if (object_.isLiteral) Some(object_.asLiteral()) else None)

  protected final def getPropertyObjectLiterals(property: Property): List[Literal] =
    getPropertyObjects(property).flatMap(object_ => if (object_.isLiteral) Some(object_.asLiteral()) else None)

  protected final def getPropertyObjectResource(property: Property): Option[Resource] =
    Some(getPropertyObjectResources(property).head)

  protected final def getPropertyObjectResources(property: Property): List[Resource] =
    getPropertyObjects(property).flatMap(node => if (node.isResource) Some(node.asResource()) else None)

  protected final def getPropertyObjectResourceIdentifier(property: Property): Option[String] =
    getPropertyObjectResourceString(property, DCTerms.identifier)

  protected final def getPropertyObjectResourceLabel(property: Property): Option[String] =
    getPropertyObjectResourceString(property, RDFS.label)

  protected final def getPropertyObjectResourceString(property: Property, literal: Property): Option[String] =
    Some(getPropertyObjectResource(property).get.getProperty(literal).getObject.asLiteral.getString)

  protected final def getPropertyObjectString(property: Property): Option[String] =
    getPropertyObjectLiteral(property).map(literal => literal.getString)

  protected final def getPropertyObjectStrings(property: Property): List[String] =
    getPropertyObjectLiterals(property).map(literal => literal.getString)

  protected final def getPropertyObjectUri(property: Property): Option[Uri] = {
    val uriList = getPropertyObjectUris(property)
    uriList match {
      case Nil => None
      case _ => Some(uriList.head)
    }
  }

  protected final def getPropertyObjectUris(property: Property): List[Uri] =
    getPropertyObjects(property).flatMap(object_ => if (object_.isURIResource) Some(Uri.parse(object_.asResource().getURI)) else None)

  protected val resource: Resource
}
