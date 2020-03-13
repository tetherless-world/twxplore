package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena._
import org.apache.jena.geosparql.implementation.vocabulary.Geo
import org.apache.jena.rdf.model.{Model, Resource}

final case class GenericFeature(geometry: Geometry, uri: Uri, label: Option[String] = None)

object GenericFeature {

  // Mix in whichever enrichments we want
  implicit class GenericFeatureResource(val resource: Resource)
    extends RdfProperties
      with RdfsProperties

  implicit object FeatureRdfReader extends RdfReader[GenericFeature] {
    override def read(resource: Resource): GenericFeature =
      GenericFeature(
        geometry = Rdf.read[Geometry](resource.getProperty(Geo.HAS_DEFAULT_GEOMETRY_PROP).getObject.asResource()),
        label = resource.label,
//        `type` = resource.types.flatMap(typeResource => FeatureType.values.find(value => typeResource.getURI == value.uri.toString)).headOption,
        uri = Uri.parse(resource.getURI)
      )
  }

  implicit object FeatureRdfWriter extends RdfWriter[GenericFeature] {
    override def write(model: Model, value: GenericFeature): Resource = {
      val resource = model.createResource(value.uri.toString)
      resource.`type` = Geo.FEATURE_RES
      //      resource.addProperty(RDF.`type`, Geo.FEATURE_RES)
      if (value.label.isDefined) resource.label = value.label.get
//      if (value.`type`.isDefined) resource.addProperty(RDF.`type`, model.createResource(value.`type`.get.uri.toString))
      resource.addProperty(Geo.HAS_DEFAULT_GEOMETRY_PROP, Rdf.write[Geometry](model, value.geometry))
    }
  }
}
