from typing import Generator
from zipfile import ZipFile

from geo_cli.etl.uls._uls_transformer import _UlsTransformer
from geo_cli.model.uls_entity import UlsEntity
from geo_cli.path import DATA_DIR_PATH


class UlsEntityTransformer(_UlsTransformer):
    def __init__(self, zip_file_base_name: str):
        self.__zip_file_base_name = zip_file_base_name

    def transform(self) -> Generator[UlsEntity, None, None]:
        with ZipFile(DATA_DIR_PATH / "extracted" / "uls" / (self.__zip_file_base_name + ".zip")) as zip_file:
            yield from self._transform_entities(zip_file)
