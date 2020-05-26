from abc import ABC
from typing import Optional

from geo_cli.etl._extractor import _Extractor
from geo_cli.etl._feature_loader import _FeatureLoader
from geo_cli.etl._feature_transformer import _FeatureTransformer
from geo_cli.etl.file_rdf_feature_loader import FileRdfFeatureLoader
from geo_cli.etl.nop_extractor import NopExtractor
from geo_cli.path import DATA_DIR_PATH


class _Pipeline(ABC):
    def __init__(self, *, id: str, transformer: _FeatureTransformer, extractor: Optional[_Extractor] = NopExtractor(), loader: Optional[_FeatureLoader] = None):
        self.__id = id
        self.__extractor = extractor
        if loader is None:
            loader = FileRdfFeatureLoader(ttl_file_path=DATA_DIR_PATH / "loaded" / id / "features.ttl")
        self.__loader = loader
        self.__transformer = transformer

    @property
    def extractor(self) -> _Extractor:
        return self.__extractor

    @property
    def id(self) -> str:
        return self.__id

    @property
    def loader(self) -> _FeatureLoader:
        return self.__loader

    @property
    def transformer(self) -> _FeatureTransformer:
        return self.__transformer
