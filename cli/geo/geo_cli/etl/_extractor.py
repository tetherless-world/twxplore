from abc import ABC, abstractmethod
from typing import Dict
import logging


class _Extractor(ABC):
    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)

    @abstractmethod
    def extract(self) -> Dict[str, object]:
        """
        Extract to DATA_DIR_PATH.
        :return: a dict of **kwds to pass to transformer.transform
        """
