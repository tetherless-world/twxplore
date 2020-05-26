import logging
from abc import ABC, abstractmethod
from typing import Generator

from geo_cli.etl._loader import _Loader
from geo_cli.model.feature import Feature


class _FeatureLoader(_Loader):
    @abstractmethod
    def load(self, features: Generator[Feature, None, None]) -> None:
        """
        Load features from the given generator.
        """
