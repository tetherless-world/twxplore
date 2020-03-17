from typing import Optional

from rdflib import Graph, URIRef, RDFS, RDF, Literal

from geo_cli.namespace import GEO, SF


class Geometry:
    def __init__(self, *, uri: URIRef, wkt: str, label: Optional[str] = None):
        self.__label = label
        self.__uri = uri
        self.__wkt = wkt

    @property
    def label(self) -> Optional[str]:
        return self.__label

    @property
    def uri(self) -> URIRef:
        return self.__uri

    @property
    def wkt(self) -> str:
        return self.__wkt
