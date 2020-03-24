from io import TextIOWrapper
from typing import Generator, Optional
from zipfile import ZipFile

from geo_cli.model.uls_record import UlsRecord
from geo_cli.model.uls_record_format import UlsRecordFormat
from geo_cli.path import DATA_DIR_PATH


class UlsRecordTransformer:
    def __init__(self, *, record_format: UlsRecordFormat, zip_file: Optional[ZipFile]=None, zip_file_base_name: Optional[str]=None):
        self.__record_format = record_format
        assert (zip_file is not None) ^ (zip_file_base_name is not None)
        self.__zip_file = zip_file
        self.__zip_file_base_name = zip_file_base_name

    def transform(self) -> Generator[UlsRecord, None, None]:
        if self.__zip_file is not None:
            yield from self.__transform(self.__zip_file)
        else:
            with ZipFile(DATA_DIR_PATH / "extracted" / "uls" / (self.__zip_file_base_name + ".zip")) as zip_file:
                yield from self.__transform(zip_file)

    def __transform(self, zip_file: ZipFile) -> Generator[UlsRecord, None, None]:
        with zip_file.open(self.__record_format.record_type + ".dat") as dat_file:
            for line in TextIOWrapper(dat_file, "utf-8"):
                yield UlsRecord(data=line.split("|"), format_=self.__record_format)
