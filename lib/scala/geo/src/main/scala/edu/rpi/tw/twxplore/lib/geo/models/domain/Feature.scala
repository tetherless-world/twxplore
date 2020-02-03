package edu.rpi.tw.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{Rdf, RdfReader, RdfWriter}
import org.apache.jena.geosparql.implementation.vocabulary.Geo
import org.apache.jena.rdf.model.{Resource, ResourceFactory}
import org.apache.jena.vocabulary.RDFS

final case class Feature(geometry: Geometry, label: Option[String], uri: Uri)

object Feature {
  import edu.rpi.tw.twxplore.lib.base.models.domain.RdfResourceWrapper._
  import edu.rpi.tw.twxplore.lib.base.models.domain.RdfsResourceWrapper._

  implicit object FeatureRdfReader extends RdfReader[Feature] {
    override def read(resource: Resource): Feature =
      Feature(
        geometry = Rdf.read[Geometry](resource.getProperty(Geo.HAS_DEFAULT_GEOMETRY_PROP).getObject.asResource()),
        label = Option(resource.getProperty(RDFS.label)).map(statement => statement.getObject.asLiteral().getString),
        uri = Uri.parse(resource.getURI)
      )
  }

  implicit object FeatureRdfWriter extends RdfWriter[Feature] {
    override def write(value: Feature): Resource = {
      val resource = ResourceFactory.createResource(value.uri.toString)
      resource.`type` = Geo.FEATURE_RES
      //      resource.addProperty(RDF.`type`, Geo.FEATURE_RES)
      if (value.label.isDefined) resource.label = value.label.get
      resource.addProperty(Geo.HAS_DEFAULT_GEOMETRY_PROP, Rdf.write[Geometry](value.geometry))
    }
  }
}
