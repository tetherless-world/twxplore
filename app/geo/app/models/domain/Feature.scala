package models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena._
import io.github.tetherlessworld.twxplore.lib.geo.models.domain.Geometry
import models.domain.vocabulary.LOCAL
import org.apache.jena.geosparql.implementation.vocabulary.Geo
import org.apache.jena.rdf.model.{Model, Resource}
import org.apache.jena.vocabulary.RDF

final case class Feature(
                          geometry: Geometry,
                          uri: Uri,
                          frequency: Option[Double] = None,
                          label: Option[String] = None,
                          `type`: Option[FeatureType] = None,
                        ) extends io.github.tetherlessworld.twxplore.lib.geo.models.domain.Feature

object Feature {

  // Mix in whichever enrichments we want
  implicit class FeatureResource(val resource: Resource)
    extends RdfProperties
      with RdfsProperties {
    final def frequency: Option[Double] = getPropertyObjectLiterals(LOCAL.frequency).headOption.map(literal => literal.getDouble)

    final def frequency_=(value: Double) = setPropertyLiteral(LOCAL.frequency, value)
  }

  implicit object FeatureRdfReader extends RdfReader[Feature] {
    override def read(resource: Resource): Feature =
      Feature(
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
      if (value.frequency.isDefined) resource.frequency = value.frequency.get
      if (value.label.isDefined) resource.label = value.label.get
      if (value.`type`.isDefined) resource.addProperty(RDF.`type`, model.createResource(value.`type`.get.uri.toString))
      resource.addProperty(Geo.HAS_DEFAULT_GEOMETRY_PROP, Rdf.write[Geometry](model, value.geometry))
    }
  }

}
