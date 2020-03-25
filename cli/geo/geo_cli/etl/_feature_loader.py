import logging
from abc import ABC, abstractmethod
from typing import Generator

from geo_cli.model.feature import Feature


class _FeatureLoader(ABC):
    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)

    @abstractmethod
    def __enter__(self):
        pass

    @abstractmethod
    def __exit__(self):
        pass

    @abstractmethod
    def load(self, features: Generator[Feature, None, None]) -> None:
        pass
