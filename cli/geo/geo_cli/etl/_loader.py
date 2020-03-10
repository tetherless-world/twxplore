from abc import ABC, abstractmethod
from typing import Generator

from rdflib import Graph

from geo_cli.model.feature import Feature


class _Loader(ABC):
    def __init__(self):
        self.__graph = Graph()

    @abstractmethod
    def __enter__(self):
        pass

    @abstractmethod
    def __exit__(self, *args, **kwds):
        pass

    @abstractmethod
    def load(self, feature_generator: Generator[Feature, None, None]):
        pass
