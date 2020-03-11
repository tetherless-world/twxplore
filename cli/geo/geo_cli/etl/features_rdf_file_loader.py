import os.path
import subprocess
from pathlib import Path
from typing import Generator

from rdflib import Graph

from geo_cli.model.feature import Feature


class FeaturesRdfFileLoader:
    def __init__(self, ttl_file_path: Path):
        self.__ttl_file_path = ttl_file_path

    def __enter__(self):
        self.__graph = Graph()
        return self

    def __exit__(self, *args, **kwds):
        ttl_dir_path = os.path.split(self.__ttl_file_path)[0]
        if not os.path.isdir(ttl_dir_path):
            os.makedirs(ttl_dir_path)
        self.__graph.serialize(destination=str(self.__ttl_file_path), format="ttl")
        subprocess.call(["bzip2", "-9", "-k", "-f", str(self.__ttl_file_path)])

    def load(self, features: Generator[Feature, None, None]):
        for feature in features:
            feature.to_rdf(self.__graph)
