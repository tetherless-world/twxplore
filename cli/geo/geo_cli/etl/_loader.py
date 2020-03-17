from abc import ABC, abstractmethod
from typing import Generator

from geo_cli.model.feature import Feature


class _Loader(ABC):
    @abstractmethod
    def __enter__(self):
        pass

    @abstractmethod
    def __exit__(self):
        pass

    @abstractmethod
    def load(self, features: Generator[Feature, None, None]) -> None:
        pass
