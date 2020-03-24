from abc import ABC, abstractmethod
from typing import Optional, Tuple

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
    def regions(self) -> Optional[Tuple[str, ...]]:
        pass

    @property
    @abstractmethod
    def type(self) -> URIRef:
        pass
