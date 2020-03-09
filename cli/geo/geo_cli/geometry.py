from typing import Optional

from rdflib import Graph, URIRef, RDFS, RDF, Literal

from .namespace import GEO, SF


class Geometry:
    def __init__(self, *, uri: URIRef, wkt: str, label: Optional[str] = None):
        self.__label = label
        self.__uri = uri
        self.__wkt = wkt

    def to_rdf(self, graph: Graph) -> None:
        graph.add((self.__uri, RDF.type, SF.Geometry))
        if self.__label is not None:
            graph.add((self.__uri, RDFS.label, Literal(self.__label)))
        graph.add((self.__uri, GEO.asWKT, Literal(self.__wkt, datatype=GEO.wktLiteral))

    @property
    def uri(self) -> URIRef:
        return self.__uri
