from typing import Optional, NamedTuple

from rdflib import URIRef


class Geometry(NamedTuple):
    uri: URIRef
    wkt: str
    label: Optional[str] = None
