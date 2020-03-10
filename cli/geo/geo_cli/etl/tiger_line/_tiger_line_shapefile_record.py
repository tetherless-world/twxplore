from abc import ABC, abstractmethod

from rdflib import URIRef


class _TigerLineShapefileRecord(ABC):
    def __init__(self, record):
        self._record = record

    @property
    @abstractmethod
    def label(self) -> str:
        pass

    @property
    @abstractmethod
    def type(self) -> URIRef:
        pass
