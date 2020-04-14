import json
from typing import Generator

from geo_cli.etl._feature_transformer import _FeatureTransformer
from geo_cli.model.feature import Feature
from geo_cli.path import ROOT_DIR_PATH


class DsaRequestFeatureTransformer(_FeatureTransformer):
    def transform(self, **kwds) -> Generator[Feature, None, None]:
        request_locations_json_file_path = (ROOT_DIR_PATH / ".." / "DynamicSpectrumAccess" / "ontologies" / "request-locations.json").absolute()
        with open(request_locations_json_file_path) as request_locations_json_file:
            request_locations_json_objects = json.load(request_locations_json_file)
            for request_locations_json_object in request_locations_json_objects:
                print(request_locations_json_object)
