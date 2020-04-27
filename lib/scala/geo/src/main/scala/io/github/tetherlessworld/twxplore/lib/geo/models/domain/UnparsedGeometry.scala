package io.github.tetherlessworld.twxplore.lib.geo.models.domain

import com.github.raduba.gis.WktParser
import edu.rpi.tw.twks.uri.Uri
import io.github.tetherlessworld.scena.{RdfProperties, RdfReader, RdfWriter, RdfsProperties}
import org.apache.jena.datatypes.TypeMapper
import org.apache.jena.geosparql.implementation.datatype.WKTDatatype
import org.apache.jena.geosparql.implementation.vocabulary.Geo
import org.apache.jena.rdf.model.{Model, Resource, ResourceFactory}

final case class UnparsedGeometry(label: Option[String], uri: Uri, wkt: String) extends Geometry {
  def parse(): Option[ParsedGeometry] = {
    WktParser.parseAll(WktParser.geometry, wkt) match {
      case WktParser.Success(parsedWkt, _) => Some(ParsedGeometry(label, parsedWkt, uri, wkt))
      case _ => None
    }
  }
}

object UnparsedGeometry {
  TypeMapper.getInstance().registerDatatype(WKTDatatype.INSTANCE)

  implicit class GeometryResource(val resource: Resource)
    extends RdfProperties
      with RdfsProperties

  implicit object GeometryRdfReader extends RdfReader[UnparsedGeometry] {
    override def read(resource: Resource): UnparsedGeometry =
      UnparsedGeometry(
        label = resource.labels.headOption,
        uri = Uri.parse(resource.getURI),
        wkt = resource.getProperty(Geo.AS_WKT_PROP).getObject.asLiteral().getString
      )
  }

  implicit object GeometryRdfWriter extends RdfWriter[UnparsedGeometry] {
    override def write(model: Model, value: UnparsedGeometry): Resource = {
      val resource = model.createResource(value.uri.toString)
      resource.types = List(resource.getModel.createResource("http://www.opengis.net/ont/sf#Geometry"))
      if (value.label.isDefined)  resource.labels = List(value.label.get)
      resource.addProperty(Geo.AS_WKT_PROP, ResourceFactory.createTypedLiteral(value.wkt, WKTDatatype.INSTANCE))
    }
  }
}
