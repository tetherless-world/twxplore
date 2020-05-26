import logging
from abc import ABC, abstractmethod
from typing import Generator

from geo_cli.model.feature import Feature


class _FeatureLoader(ABC):
    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)

    def __enter__(self):
        """
        Enter the loader. Typically used to open resources, such as files.
        """

    def __exit__(self):
        """
        Exit the loader. Typically used to close resources, such as files.
        """

    @abstractmethod
    def load(self, features: Generator[Feature, None, None]) -> None:
        """
        Load features from the given generator.
        """
