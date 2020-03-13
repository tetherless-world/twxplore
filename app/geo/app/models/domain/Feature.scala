package models.domain

import java.util.{Calendar, Date}

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena._
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.Geometry
import models.domain.vocabulary.LOCAL
import org.apache.jena.datatypes.xsd.XSDDateTime
import org.apache.jena.geosparql.implementation.vocabulary.Geo
import org.apache.jena.rdf.model.{Model, Resource, ResourceFactory}
import org.apache.jena.vocabulary.RDF

final case class Feature(
                          geometry: Geometry,
                          uri: Uri,
                          dateTime: Option[Date] = None,
                          frequency: Option[Double] = None,
                          label: Option[String] = None,
                          `type`: Option[FeatureType] = None,
                        ) extends io.github.tetherlessworld.twxplore.lib.geo.models.domain.Feature

object Feature {

  // Mix in whichever enrichments we want
  implicit class FeatureResource(val resource: Resource)
    extends RdfProperties
      with RdfsProperties {
    final def dateTime: Option[Date] = getPropertyObjectLiterals(LOCAL.dateTime).headOption.map(literal => literal.getValue.asInstanceOf[XSDDateTime].asCalendar().getTime)
    final def dateTime_=(value: Date) = { val calendar = Calendar.getInstance(); calendar.setTime(value); resource.addProperty(LOCAL.dateTime, ResourceFactory.createTypedLiteral(new XSDDateTime(calendar))); }

    final def frequency: Option[Double] = getPropertyObjectLiterals(LOCAL.frequency).headOption.map(literal => literal.getFloat.asInstanceOf[Double])

    final def frequency_=(value: Double) = setPropertyLiteral(LOCAL.frequency, value.asInstanceOf[Float])
  }

  implicit object FeatureRdfReader extends RdfReader[Feature] {
    override def read(resource: Resource): Feature =
      Feature(
        dateTime = resource.dateTime,
        frequency = resource.frequency,
        geometry = Rdf.read[Geometry](resource.getProperty(Geo.HAS_DEFAULT_GEOMETRY_PROP).getObject.asResource()),
        label = resource.label,
        `type` = resource.types.flatMap(typeResource => FeatureType.values.find(value => typeResource.getURI == value.uri.toString)).headOption,
        uri = Uri.parse(resource.getURI)
      )
  }

  implicit object FeatureRdfWriter extends RdfWriter[Feature] {
    override def write(model: Model, value: Feature): Resource = {
      val resource = model.createResource(value.uri.toString)
      resource.`type` = Geo.FEATURE_RES
      //      resource.addProperty(RDF.`type`, Geo.FEATURE_RES)
      if (value.dateTime.isDefined) resource.dateTime = value.dateTime.get
      if (value.frequency.isDefined) resource.frequency = value.frequency.get
      if (value.label.isDefined) resource.label = value.label.get
      if (value.`type`.isDefined) resource.addProperty(RDF.`type`, model.createResource(value.`type`.get.uri.toString))
      resource.addProperty(Geo.HAS_DEFAULT_GEOMETRY_PROP, Rdf.write[Geometry](model, value.geometry))
    }
  }

}
