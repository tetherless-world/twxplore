from datetime import datetime
from typing import Optional

from rdflib import Graph, URIRef, RDF, RDFS, Literal, XSD

from geo_cli.model.frequency_range import FrequencyRange
from geo_cli.model.geometry import Geometry
from geo_cli.namespace import GEO, TWXPLORE_GEO_APP_ONTOLOGY


class Feature:
    def __init__(
            self, *,
            geometry: Geometry,
            label: str,
            uri: URIRef,
            frequency: Optional[float] = None,
            frequency_range: Optional[FrequencyRange] = None,
            timestamp: Optional[datetime],
            transmission_power: Optional[int] = None,
            type: Optional[URIRef] = None
    ):
        if timestamp is not None:
            assert timestamp.tzinfo is not None
        self.__timestamp = timestamp
        self.__frequency = frequency
        self.__frequency_range = frequency_range
        self.__geometry = geometry
        self.__label = label
        self.__transmission_power = transmission_power
        self.__type = type
        self.__uri = uri

    def to_rdf(self, graph: Graph):
        graph.add((self.__uri, RDF.type, GEO.Feature))

        if self.__frequency is not None:
            graph.add((self.__uri, TWXPLORE_GEO_APP_ONTOLOGY.frequency, Literal(self.__frequency, datatype=XSD.float)))
        elif self.__frequency_range is not None:
            raise NotImplementedError

        graph.add((self.__uri, GEO.hasDefaultGeometry, self.__geometry.uri))
        self.__geometry.to_rdf(graph)

        if self.__label is not None:
            graph.add((self.__uri, RDFS.label, Literal(self.__label)))

        if self.__timestamp is not None:
            graph.add((self.__uri, TWXPLORE_GEO_APP_ONTOLOGY.timestamp, Literal(self.__timestamp, datatype=XSD.dateTime)))

        if self.__transmission_power is not None:
            graph.add((self.__uri, TWXPLORE_GEO_APP_ONTOLOGY.transmissionPower, Literal(self.__transmission_power, datatype=XSD.int)))

        if self.__type is not None:
            graph.add((self.__uri, RDF.type, self.__type))
