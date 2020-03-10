from abc import ABC, abstractmethod
from typing import Generator

from geo_cli.model.feature import Feature


class _Transformer(ABC):
    @abstractmethod
    def transform(self) -> Generator[Feature, None, None]:
        pass

