from typing import Generator

from geo_cli.etl._feature_loader import _FeatureLoader
from geo_cli.etl.file_rdf_feature_loader import FileRdfFeatureLoader
from geo_cli.etl.request_json_feature_loader import RequestJsonFeatureLoader
from geo_cli.model.feature import Feature
from geo_cli.path import DATA_DIR_PATH


class ReverseBeaconFeatureLoader(_FeatureLoader):
    def load(self, features: Generator[Feature, None, None]) -> None:
        with FileRdfFeatureLoader(DATA_DIR_PATH / "loaded" / "reverse_beacon" / "features.ttl") as rdf_file_loader:
            with RequestJsonFeatureLoader(DATA_DIR_PATH / "loaded" / "reverse_beacon" / "requests.json") as request_json_loader:
                rdf_file_loader.load(features)
                request_json_loader.load(features)


