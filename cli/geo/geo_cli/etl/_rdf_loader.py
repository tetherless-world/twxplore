from rdflib import Graph, RDF, Literal, XSD, RDFS

from geo_cli.etl._loader import _Loader
from geo_cli.namespace import TWXPLORE_GEO_APP_ONTOLOGY, GEO, SF, SCHEMA, TWXPLORE_GEO_APP_FEATURE, \
    TWXPLORE_GEO_APP_GEOMETRY


class _RdfLoader(_Loader):
    def __enter__(self):
        self._graph = Graph()
        self._graph.bind("geo", GEO)
        self._graph.bind("schema", SCHEMA)
        self._graph.bind("sf", SF)
        self._graph.bind("twxplore-geo-app-feature", TWXPLORE_GEO_APP_FEATURE)
        self._graph.bind("twxplore-geo-app-geometry", TWXPLORE_GEO_APP_GEOMETRY)
        self._graph.bind("twxplore-geo-app-ontology", TWXPLORE_GEO_APP_ONTOLOGY)
        return self

    def _add_feature_to_graph(self, feature):
        self._graph.add((feature.uri, RDF.type, GEO.Feature))

        if feature.frequency is not None:
            self._graph.add((feature.uri, TWXPLORE_GEO_APP_ONTOLOGY.frequency, Literal(feature.frequency, datatype=XSD.float)))
        elif feature.frequency_range is not None:
            raise NotImplementedError

        self._graph.add((feature.uri, GEO.hasDefaultGeometry, feature.geometry.uri))
        self.__add_geometry_to_graph(feature.geometry)

        if feature.label is not None:
            self._graph.add((feature.uri, RDFS.label, Literal(feature.label)))

        if feature.timestamp is not None:
            self._graph.add((feature.uri, TWXPLORE_GEO_APP_ONTOLOGY.timestamp, Literal(feature.timestamp, datatype=XSD.dateTime)))

        if feature.transmission_power is not None:
            self._graph.add((feature.uri, TWXPLORE_GEO_APP_ONTOLOGY.transmissionPower, Literal(feature.transmission_power, datatype=XSD.int)))

        if feature.type is not None:
            self._graph.add((feature.uri, RDF.type, feature.type))

    def __add_geometry_to_graph(self, geometry):
        self._graph.add((geometry.uri, RDF.type, SF.Geometry))
        if geometry.label is not None:
            self._graph.add((geometry.uri, RDFS.label, Literal(geometry.label)))
        self._graph.add((geometry.uri, GEO.asWKT, Literal(geometry.wkt, datatype=GEO.wktLiteral)))
