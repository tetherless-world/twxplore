import json
import logging
import os.path
from pathlib import Path
from typing import Generator

from geo_cli.model.uls_entity import UlsEntity
from geo_cli.path import DATA_DIR_PATH


class UlsEntitiesJsonFileLoader:
    __TRANSFORMED_DATA_DIR_PATH = DATA_DIR_PATH / "transformed" / "uls"

    def __init__(self, file_name_prefix: str):
        self.__file_name_prefix = file_name_prefix
        self.__logger = logging.getLogger(self.__class__.__name__)

    def __enter__(self):
        self.__uls_entities_by_call_sign = {}
        return self

    def __exit__(self, *args, **kwds):
        if not os.path.isdir(self.__TRANSFORMED_DATA_DIR_PATH):
            os.makedirs(self.__TRANSFORMED_DATA_DIR_PATH)
            self.__logger.info("created directory %s", self.__TRANSFORMED_DATA_DIR_PATH)

        file_path = self.loaded_file_path(self.__file_name_prefix)
        with open(file_path, "w+") as file_:
            json.dump({key: value.__dict__ for key, value in self.__uls_entities_by_call_sign.items() if not key.startswith("_")}, file_)
        self.__logger.info("wrote file %s", file_path)

    def load(self, entities: Generator[UlsEntity, None, None]):
        for entity in entities:
            self.__uls_entities_by_call_sign[entity.call_sign] = entity

    @classmethod
    def loaded_file_path(cls, file_name_prefix) -> Path:
        return cls.__TRANSFORMED_DATA_DIR_PATH / (file_name_prefix + "_uls_entities_by_call_sign.json")
