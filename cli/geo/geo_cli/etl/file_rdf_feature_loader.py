import os.path
import subprocess
from pathlib import Path
from typing import Generator

from geo_cli.etl._rdf_feature_loader import _RdfFeatureLoader
from geo_cli.model.feature import Feature


class FileRdfFeatureLoader(_RdfFeatureLoader):
    def __init__(self, ttl_file_path: Path):
        _RdfFeatureLoader.__init__(self)
        self.__ttl_file_path = ttl_file_path

    def __exit__(self, *args, **kwds):
        ttl_dir_path = os.path.split(self.__ttl_file_path)[0]
        if not os.path.isdir(ttl_dir_path):
            os.makedirs(ttl_dir_path)
        self._graph.serialize(destination=str(self.__ttl_file_path), format="ttl")
        subprocess.call(["bzip2", "-9", "-k", "-f", str(self.__ttl_file_path)])

    def load(self, features: Generator[Feature, None, None]):
        feature_count = 0
        for feature in features:
            self._add_feature_to_graph(feature)
            feature_count += 1
            if feature_count % 1000 == 0:
                self._logger.info("added %d features to the graph for %s", feature_count, self.__ttl_file_path)
        self._logger.info("added %d features to the graph for %s", feature_count, self.__ttl_file_path)
