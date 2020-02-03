package edu.rpi.tw.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import edu.rpi.tw.twxplore.lib.base.models.domain.{RdfProperties, RdfsProperties}
import io.github.tetherlessworld.scena.{RdfReader, RdfWriter}
import org.apache.jena.datatypes.TypeMapper
import org.apache.jena.geosparql.implementation.datatype.WKTDatatype
import org.apache.jena.geosparql.implementation.vocabulary.Geo
import org.apache.jena.rdf.model.{Model, Resource, ResourceFactory}

final case class Geometry(label: Option[String], uri: Uri, wkt: String)

object Geometry {
  TypeMapper.getInstance().registerDatatype(WKTDatatype.INSTANCE)

  implicit class GeometryResource(val resource: Resource)
    extends RdfProperties
      with RdfsProperties

  implicit object GeometryRdfReader extends RdfReader[Geometry] {
    override def read(resource: Resource): Geometry =
      Geometry(
        label = resource.label,
        uri = Uri.parse(resource.getURI),
        wkt = resource.getProperty(Geo.AS_WKT_PROP).getObject.asLiteral().getString
      )
  }

  implicit object GeometryRdfWriter extends RdfWriter[Geometry] {
    override def write(model: Model, value: Geometry): Resource = {
      val resource = model.createResource(value.uri.toString)
      resource.`type` = resource.getModel.createResource("http://www.opengis.net/ont/sf#Geometry")
      value.label.foreach(label => resource.label = label)
      resource.addProperty(Geo.AS_WKT_PROP, ResourceFactory.createTypedLiteral(value.wkt, WKTDatatype.INSTANCE))
    }
  }
}
