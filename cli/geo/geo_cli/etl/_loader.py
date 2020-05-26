from abc import ABC
import logging


class _Loader(ABC):
    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)

    def __enter__(self):
        """
        Enter the loader. Typically used to open resources, such as files.
        """
        return self

    def __exit__(self, *args, **kwds):
        """
        Exit the loader. Typically used to close resources, such as files.
        """
