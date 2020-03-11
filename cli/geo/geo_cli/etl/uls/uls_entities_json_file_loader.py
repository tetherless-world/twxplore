import json
import logging
import os.path
from typing import Generator

from geo_cli.model.uls_entity import UlsEntity
from geo_cli.path import DATA_DIR_PATH


class UlsEntitiesJsonFileLoader:
    __TRANSFORMED_DATA_DIR_PATH = DATA_DIR_PATH / "transformed" / "uls"
    ULS_ENTITIES_BY_CALL_SIGN_JSON_FILE_PATH = __TRANSFORMED_DATA_DIR_PATH / "uls_entities_by_call_sign.json"

    def __init__(self):
        self.__logger = logging.getLogger(self.__class__.__name__)

    def __enter__(self):
        self.__uls_entities_by_call_sign = {}
        return self

    def __exit__(self, *args, **kwds):
        if not os.path.isdir(self.__TRANSFORMED_DATA_DIR_PATH):
            os.makedirs(self.__TRANSFORMED_DATA_DIR_PATH)
            self.__logger.info("created directory %s", self.__TRANSFORMED_DATA_DIR_PATH)

        with open(self.ULS_ENTITIES_BY_CALL_SIGN_JSON_FILE_PATH, "w+") as file_:
            json.dump({key: value.__dict__ for key, value in self.__uls_entities_by_call_sign.items() if not key.startswith("_")}, file_)
        self.__logger.info("wrote file %s", self.ULS_ENTITIES_BY_CALL_SIGN_JSON_FILE_PATH)

    def load(self, entities: Generator[UlsEntity, None, None]):
        for entity in entities:
            self.__uls_entities_by_call_sign[entity.call_sign] = entity
