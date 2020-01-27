package edu.rpi.tw.twxplore.lib.geo.models.domain

import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{RdfReader, RdfWriter}
import org.apache.jena.datatypes.TypeMapper
import org.apache.jena.geosparql.implementation.datatype.WKTDatatype
import org.apache.jena.geosparql.implementation.vocabulary.Geo
import org.apache.jena.rdf.model.{Resource, ResourceFactory}
import org.apache.jena.vocabulary.{RDF, RDFS}

final case class Geometry(label: Option[String], uri: Uri, wkt: String)

object Geometry {
  TypeMapper.getInstance().registerDatatype(WKTDatatype.INSTANCE)

  implicit object GeometryRdfReader extends RdfReader[Geometry] {
    override def read(resource: Resource): Geometry =
      Geometry(
        label = Option(resource.getProperty(RDFS.label)).map(statement => statement.getObject.asLiteral().getString),
        uri = Uri.parse(resource.getURI),
        wkt = resource.getProperty(Geo.AS_WKT_PROP).getObject.asLiteral().getString
      )
  }

  implicit object GeometryRdfWriter extends RdfWriter[Geometry] {
    override def write(value: Geometry): Resource = {
      val resource = ResourceFactory.createResource(value.uri.toString)
      resource.addProperty(RDF.`type`, resource.getModel.createResource("http://www.opengis.net/ont/sf#Geometry"))
      value.label.foreach(label => resource.addProperty(RDFS.label, label))
      resource.addProperty(Geo.AS_WKT_PROP, ResourceFactory.createTypedLiteral(value.wkt, WKTDatatype.INSTANCE))
    }
  }
}
