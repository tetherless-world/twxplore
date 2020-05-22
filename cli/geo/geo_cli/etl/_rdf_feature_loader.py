from rdflib import Graph, RDF, Literal, XSD, RDFS

from geo_cli.etl._feature_loader import _FeatureLoader
from geo_cli.namespace import TWXPLORE_GEO_APP_ONTOLOGY, GEO, SF, SCHEMA, TWXPLORE_GEO_APP_FEATURE, \
    TWXPLORE_GEO_APP_GEOMETRY


class _RdfFeatureLoader(_FeatureLoader):
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
        feature_resource = self._graph.resource(feature.uri)

        feature_resource.add(RDF.type, GEO.Feature)

        if feature.frequency is not None or feature.frequency_range is not None:
            if feature.frequency is not None:
                feature_resource.add(TWXPLORE_GEO_APP_ONTOLOGY.frequency, Literal(feature.frequency, datatype=XSD.float))
            elif feature.frequency_range is not None:
                feature_resource.add(TWXPLORE_GEO_APP_ONTOLOGY.frequencyMaximum, Literal(feature.frequency_range[1], datatype=XSD.float))
                feature_resource.add(TWXPLORE_GEO_APP_ONTOLOGY.frequencyMinimum, Literal(feature.frequency_range[0], datatype=XSD.float))
            else:
                raise NotImplementedError
            assert feature.frequency_unit is not None
            feature_resource.add(TWXPLORE_GEO_APP_ONTOLOGY.frequencyUnit, Literal(feature.frequency_unit))

        feature_resource.add(GEO.hasDefaultGeometry, self.__add_geometry_to_graph(feature.geometry))

        if feature.label is not None:
            feature_resource.add(RDFS.label, Literal(feature.label))

        if feature.locality is not None:
            feature_resource.add(SCHEMA.addressLocality, Literal(feature.locality))

        if feature.postal_code is not None:
            feature_resource.add(SCHEMA.postalCode, Literal(feature.postal_code))

        if feature.regions is not None:
            for region in feature.regions:
                feature_resource.add(SCHEMA.addressRegion, Literal(region))

        if feature.timestamp is not None:
            feature_resource.add(TWXPLORE_GEO_APP_ONTOLOGY.timestamp, Literal(feature.timestamp, datatype=XSD.dateTime))
        elif feature.timestamp_range is not None:
            feature_resource.add(TWXPLORE_GEO_APP_ONTOLOGY.timestampMaximum, Literal(feature.timestamp_range[1], datatype=XSD.dateTime))
            feature_resource.add(TWXPLORE_GEO_APP_ONTOLOGY.timestampMinimum, Literal(feature.timestamp_range[0], datatype=XSD.dateTime))

        if feature.transmission_power is not None:
            feature_resource.add(TWXPLORE_GEO_APP_ONTOLOGY.transmissionPower, Literal(feature.transmission_power, datatype=XSD.int))

        if feature.type is not None:
            feature_resource.add(RDF.type, feature.type)

    def __add_geometry_to_graph(self, geometry):
        geometry_resource = self._graph.resource(geometry.uri)
        geometry_resource.add(RDF.type, SF.Geometry)
        if geometry.label is not None:
            geometry_resource.add(RDFS.label, Literal(geometry.label))
        geometry_resource.add(GEO.asWKT, Literal(geometry.wkt, datatype=GEO.wktLiteral))
        return geometry_resource
