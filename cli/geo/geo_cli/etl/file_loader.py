import subprocess
from pathlib import Path
from typing import Generator

from rdflib import Graph

from geo_cli.etl._loader import _Loader
from geo_cli.model.feature import Feature


class FileLoader(_Loader):
    def __init__(self, ttl_file_path: Path):
        self.__ttl_file_path = ttl_file_path

    def __enter__(self):
        self.__graph = Graph()
        return self

    def __exit__(self, *args, **kwds):
        self.__graph.serialize(destination=str(self.__ttl_file_path), format="ttl")
        subprocess.call(["bzip2", "-9", "-k", "-f", str(self.__ttl_file_path)])

    def load(self, feature_generator: Generator[Feature, None, None]):
        for feature in feature_generator:
            feature.to_rdf(self.__graph)
