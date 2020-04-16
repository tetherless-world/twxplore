import json
from datetime import datetime
from typing import Generator

from rdflib import URIRef

from geo_cli.etl._feature_transformer import _FeatureTransformer
from geo_cli.model.feature import Feature
from geo_cli.model.geometry import Geometry
from geo_cli.namespace import TWXPLORE_GEO_APP_ONTOLOGY
from geo_cli.path import ROOT_DIR_PATH


class DsaRequestFeatureTransformer(_FeatureTransformer):
    def transform(self, **kwds) -> Generator[Feature, None, None]:
        def parse_datetime(value: str) -> datetime:
            assert value.endswith("Z[GMT]"), value
            value = value[:-len("Z[GMT]")]
            value += "+00:00"
            return datetime.fromisoformat(value)

        requests_json_file_path = (ROOT_DIR_PATH / ".." / "DynamicSpectrumAccess" / "ontologies" / "requests.json").absolute()
        with open(requests_json_file_path) as requests_json_file:
            request_json_objects = json.load(requests_json_file)
            for request_json_object in request_json_objects:
                location_json_object = request_json_object["location"]
                yield \
                    Feature(
                        frequency_range=(
                            request_json_object["frequencyRange"]["minimum"],
                            request_json_object["frequencyRange"]["maximum"]
                        ),
                        geometry=Geometry(
                            uri=URIRef(location_json_object["geometry"]["id"]),
                            wkt=location_json_object["geometry"]["wkt"]
                        ),
                        label=request_json_object["id"],
                        timestamp_range=(
                            parse_datetime(request_json_object["dateRange"]["from"]),
                            parse_datetime(request_json_object["dateRange"]["until"])
                        ),
                        type=TWXPLORE_GEO_APP_ONTOLOGY.Transmission,
                        uri=URIRef("http://purl.org/twc/dsa/request/" + request_json_object["id"])
                    )
