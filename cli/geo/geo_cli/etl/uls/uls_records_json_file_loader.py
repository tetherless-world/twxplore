import json
import logging
import os.path
from pathlib import Path
from typing import Generator

from geo_cli.model.uls_record import UlsRecord
from geo_cli.path import DATA_DIR_PATH


class UlsRecordsJsonFileLoader:
    __TRANSFORMED_DATA_DIR_PATH = DATA_DIR_PATH / "transformed" / "uls"

    def __init__(self, file_name_prefix: str):
        self.__file_name_prefix = file_name_prefix
        self.__logger = logging.getLogger(self.__class__.__name__)

    def __enter__(self):
        self.__uls_records_by_call_sign = {}
        return self

    def __exit__(self, *args, **kwds):
        file_path = self.loaded_file_path(self.__file_name_prefix)

        if not self.__uls_records_by_call_sign:
            self.__logger.warning("no records loaded, not writing to %s", file_path)
            return

        if not os.path.isdir(self.__TRANSFORMED_DATA_DIR_PATH):
            os.makedirs(self.__TRANSFORMED_DATA_DIR_PATH)
            self.__logger.info("created directory %s", self.__TRANSFORMED_DATA_DIR_PATH)

        with open(file_path, "w+") as file_:
            json.dump(self.__uls_records_by_call_sign, file_)
        self.__logger.info("wrote file %s", file_path)

    def load(self, records: Generator[UlsRecord, None, None]):
        for record in records:
            self.__uls_records_by_call_sign[record["Call Sign"]] = dict(record.items())

    @classmethod
    def loaded_file_path(cls, file_name_prefix) -> Path:
        return cls.__TRANSFORMED_DATA_DIR_PATH / (file_name_prefix + "_by_call_sign.json")
