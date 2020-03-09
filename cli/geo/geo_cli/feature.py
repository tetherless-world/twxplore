from typing import Optional

from rdflib import Graph, URIRef, RDF, RDFS, Literal

from .geometry import Geometry
from .namespace import GEO


class Feature:
    def __init__(self, *, geometry: Geometry, label: str, uri: URIRef, type: Optional[URIRef]):
        self.__geometry = geometry
        self.__label = label
        self.__type = type
        self.__uri = uri

    def to_rdf(self, graph: Graph):
        graph.add((self.__uri, RDF.type, GEO.Feature))
        if self.__type is not None:
            graph.add((self.__uri, RDF.type, self.__type))
        graph.add((self.__uri, GEO.hasDefaultGeometry, self.__geometry.uri))
        self.__geometry.to_rdf(graph)
        if self.__label is not None:
            graph.add((self.__uri, RDFS.label, Literal(self.__label)))
