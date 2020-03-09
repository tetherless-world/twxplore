from rdflib import Graph, URIRef, RDF, RDFS

from .geometry import Geometry
from .namespace import SF, GEO


class Feature:
    def __init__(self, *, geometry: Geometry, label: str, uri: URIRef):
        self.__geometry = geometry
        self.__label = label
        self.__uri = uri

    def to_rdf(self, graph: Graph):
        graph.add((self.__uri, RDF.type, SF.Geometry))
        graph.add((self.__uri, GEO.hasDefaultGeometry, self.__geometry.uri))
        self.__geometry.to_rdf(graph)
        if self.__label is not None:
            graph.add((self.__uri, RDFS.label, self.__label))
