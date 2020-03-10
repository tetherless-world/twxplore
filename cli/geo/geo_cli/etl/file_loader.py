import subprocess
from typing import Generator

from rdflib import Graph

from geo_cli.etl._loader import _Loader
from geo_cli.model.feature import Feature
from geo_cli.path import DATA_DIR_PATH


class FileLoader(_Loader):
    def __enter__(self):
        self.__graph = Graph()
        return self

    def __exit__(self, *args, **kwds):
        features_ttl_file_path = str(DATA_DIR_PATH / "features.ttl")
        self.__graph.serialize(destination=features_ttl_file_path, format="ttl")
        subprocess.call(["bzip2", "-9", "-k", "-f", features_ttl_file_path])

    def load(self, feature_generator: Generator[Feature, None, None]):
        for feature in feature_generator:
            feature.to_rdf(self.__graph)
