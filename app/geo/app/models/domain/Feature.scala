package models.domain

import java.util.{Calendar, Date}

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena._
import io.github.tetherlessworld.twxplore.lib.base.models.domain.SchemaProperties
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.Geometry
import models.domain.vocabulary.LOCAL
import org.apache.jena.datatypes.xsd.XSDDateTime
import org.apache.jena.geosparql.implementation.vocabulary.Geo
import org.apache.jena.rdf.model.{Model, Resource, ResourceFactory}
import org.apache.jena.vocabulary.RDF

final case class Feature(
                          geometry: Geometry,
                          uri: Uri,
                          frequency: Option[Double] = None,
                          label: Option[String] = None,
                          locality: Option[String] = None,
                          postalCode: Option[String] = None,
                          region: Option[String] = None,
                          timestamp: Option[Date] = None,
                          transmissionPower: Option[Int] = None,
                          `type`: Option[FeatureType] = None,
                        ) extends io.github.tetherlessworld.twxplore.lib.geo.models.domain.Feature

object Feature {

  // Mix in whichever enrichments we want
  implicit class FeatureResource(val resource: Resource)
    extends RdfProperties
      with RdfsProperties
      with SchemaProperties {
    final def frequency: Option[Double] = getPropertyObjectLiterals(LOCAL.frequency).headOption.map(literal => literal.getFloat.asInstanceOf[Double])
    final def frequency_=(value: Double) = setPropertyLiteral(LOCAL.frequency, value.asInstanceOf[Float])

    final def timestamp: Option[Date] = getPropertyObjectLiterals(LOCAL.timestamp).headOption.map(literal => literal.getValue.asInstanceOf[XSDDateTime].asCalendar().getTime)
    final def timestamp_=(value: Date) = { val calendar = Calendar.getInstance(); calendar.setTime(value); resource.addProperty(LOCAL.timestamp, ResourceFactory.createTypedLiteral(new XSDDateTime(calendar))); }

    final def transmissionPower: Option[Int] = getPropertyObjectLiterals(LOCAL.transmissionPower).headOption.map(literal => literal.getInt)
    final def transmissionPower_=(value: Int) = setPropertyLiteral(LOCAL.transmissionPower, value.asInstanceOf[Int])
  }

  implicit object FeatureRdfReader extends RdfReader[Feature] {
    override def read(resource: Resource): Feature =
      Feature(
        frequency = resource.frequency,
        geometry = Rdf.read[Geometry](resource.getProperty(Geo.HAS_DEFAULT_GEOMETRY_PROP).getObject.asResource()),
        label = resource.label,
        locality = resource.addressLocality,
        postalCode = resource.postalCode,
        region = resource.addressRegion,
        timestamp = resource.timestamp,
        transmissionPower = resource.transmissionPower,
        `type` = resource.types.flatMap(typeResource => FeatureType.values.find(value => typeResource.getURI == value.uri.toString)).headOption,
        uri = Uri.parse(resource.getURI)
      )
  }

  implicit object FeatureRdfWriter extends RdfWriter[Feature] {
    override def write(model: Model, value: Feature): Resource = {
      val resource = model.createResource(value.uri.toString)
      resource.`type` = Geo.FEATURE_RES
      //      resource.addProperty(RDF.`type`, Geo.FEATURE_RES)
      if (value.frequency.isDefined) resource.frequency = value.frequency.get
      if (value.label.isDefined) resource.label = value.label.get
      if (value.locality.isDefined) resource.addressLocality = value.locality.get
      if (value.postalCode.isDefined) resource.postalCode = value.postalCode.get
      if (value.region.isDefined) resource.addressRegion = value.region.get
      if (value.timestamp.isDefined) resource.timestamp = value.timestamp.get
      if (value.transmissionPower.isDefined) resource.transmissionPower = value.transmissionPower.get
      if (value.`type`.isDefined) resource.addProperty(RDF.`type`, model.createResource(value.`type`.get.uri.toString))
      resource.addProperty(Geo.HAS_DEFAULT_GEOMETRY_PROP, Rdf.write[Geometry](model, value.geometry))
    }
  }

}
