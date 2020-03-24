from abc import ABC, abstractmethod
from typing import Optional

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
    def locality(self) -> Optional[str]:
        pass

    @property
    @abstractmethod
    def region(self) -> Optional[str]:
        pass

    @property
    @abstractmethod
    def type(self) -> URIRef:
        pass
