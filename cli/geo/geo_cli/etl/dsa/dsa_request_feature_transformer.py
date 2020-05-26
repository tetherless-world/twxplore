import json
from typing import Generator

from rdflib import URIRef

from geo_cli.etl.dsa._dsa_feature_transformer import _DsaFeatureTransformer
from geo_cli.model.feature import Feature
from geo_cli.model.geometry import Geometry
from geo_cli.namespace import TWXPLORE_GEO_APP_ONTOLOGY


class DsaRequestFeatureTransformer(_DsaFeatureTransformer):
    def transform(self, **kwds) -> Generator[Feature, None, None]:
        requests_json_file_path = self._DSA_ONTOLOGIES_DIR_PATH / "requests.json"
        yielded_features_count = 0
        with open(requests_json_file_path) as requests_json_file:
            request_json_objects = json.load(requests_json_file)
            for request_json_object in request_json_objects:
                location_json_object = request_json_object["location"]
                yield \
                    Feature(
                        frequency_range=(
                            request_json_object["frequencyRange"]["minimum"] * 1000000.0,
                            request_json_object["frequencyRange"]["maximum"] * 1000000.0
                        ),
                        geometry=Geometry(
                            uri=URIRef(location_json_object["geometry"]["id"]),
                            wkt=location_json_object["geometry"]["wkt"]
                        ),
                        label=request_json_object["id"],
                        timestamp_range=(
                            self._parse_datetime(request_json_object["dateRange"]["from"]),
                            self._parse_datetime(request_json_object["dateRange"]["until"])
                        ),
                        type=TWXPLORE_GEO_APP_ONTOLOGY.Transmission,
                        uri=URIRef("http://purl.org/twc/dsa/request/" + request_json_object["id"])
                    )
                yielded_features_count += 1
        self._logger.info("yielded %d request features", yielded_features_count)
