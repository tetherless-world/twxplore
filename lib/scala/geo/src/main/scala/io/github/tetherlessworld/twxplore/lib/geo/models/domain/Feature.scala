package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{Rdf, RdfReader, RdfWriter}
import io.github.tetherlessworld.twxplore.lib.base.models.domain.{RdfProperties, RdfsProperties}
import org.apache.jena.geosparql.implementation.vocabulary.Geo
import org.apache.jena.rdf.model.{Model, Resource}

final case class Feature(geometry: Geometry, uri: Uri, label: Option[String] = None)

object Feature {

  // Mix in whichever enrichments we want
  implicit class FeatureResource(val resource: Resource)
    extends RdfProperties
      with RdfsProperties

  implicit object FeatureRdfReader extends RdfReader[Feature] {
    override def read(resource: Resource): Feature =
      Feature(
        geometry = Rdf.read[Geometry](resource.getProperty(Geo.HAS_DEFAULT_GEOMETRY_PROP).getObject.asResource()),
        label = resource.label,
        // Option(resource.getProperty(RDFS.label)).map(statement => statement.getObject.asLiteral().getString),
        uri = Uri.parse(resource.getURI)
      )
  }

  implicit object FeatureRdfWriter extends RdfWriter[Feature] {
    override def write(model: Model, value: Feature): Resource = {
      val resource = model.createResource(value.uri.toString)
      resource.`type` = Geo.FEATURE_RES
      //      resource.addProperty(RDF.`type`, Geo.FEATURE_RES)
      if (value.label.isDefined) resource.label = value.label.get
      resource.addProperty(Geo.HAS_DEFAULT_GEOMETRY_PROP, Rdf.write[Geometry](model, value.geometry))
    }
  }
}
