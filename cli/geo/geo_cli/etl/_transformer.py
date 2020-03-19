import logging
from abc import ABC, abstractmethod
from typing import Generator

from geo_cli.model.feature import Feature


class _Transformer(ABC):
    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)

    @abstractmethod
    def transform(self) -> Generator[Feature, None, None]:
        pass

