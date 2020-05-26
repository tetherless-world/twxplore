import logging
from abc import ABC, abstractmethod
from typing import Generator

from geo_cli.model.feature import Feature


class _FeatureTransformer(ABC):
    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)

    @abstractmethod
    def transform(self, **kwds) -> Generator[Feature, None, None]:
        """
        Transform extracted data into Features.
        :param kwds: kwds dictionary returned by extractor.extract
        :return: a generator of Features
        """

