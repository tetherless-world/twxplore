package edu.rpi.tw.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import edu.rpi.tw.twxplore.lib.base.models.domain.vocabulary.SIO
import org.apache.jena.rdf.model.{Literal, Property, RDFNode, Resource}
import org.apache.jena.vocabulary.{DCTerms, RDFS}

import scala.collection.JavaConverters._
import scala.collection.mutable

trait DomainModel {
  val uri: Uri
}

trait DomainModelCompanion {

  //SIO resource wrapper associated with

  implicit class ResourceWrapper(val resource: Resource) {

    object dublinCore {
      def attributes(): Map[String, String] = {
        val attributeMap: mutable.HashMap[String, String] = new mutable.HashMap()
        val attributeList = getPropertyObjects(SIO.hasAttribute)
        for(attribute <- attributeList){
          val attributeIndex = attribute.asResource().getURI.lastIndexOf("\"")
          val attributeName = attribute.asResource().getURI.substring(attributeIndex)
          val identifier = attribute.asResource().getPropertyObjectString(DCTerms.identifier).get
          val label = attribute.asResource().getPropertyObjectString(RDFS.label).get
          if (identifier != None){
            attributeMap += (attributeName -> identifier)
          }
          else {
            attributeMap += (attributeName -> label)
          }
        }
        attributeMap.toMap
      }

      def associatedWith(): List[String] = getPropertyObjectStrings(SIO.isAssociatedWith)

      def spatioTempRelatedTo(): Option[String] = getPropertyObjectString(SIO.isSpatioTempRelatedTo)

      def getLabel(): Option[String] = getPropertyObjectString(RDFS.label)

      def locationIn(): Option[String] = getPropertyObjectString(SIO.isLocationIn)

      def locationOf(): Option[String] = getPropertyObjectString(SIO.isLocationOf)

      def identifier(): Option[String] = getPropertyObjectString(DCTerms.identifier)

      def hasValue(): Option[String] = getPropertyObjectString(SIO.hasValue)

      def hasUnit(): Option[String] = getPropertyObjectString(SIO.hasUnit)

    }

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

}
