import json
from typing import Generator

from rdflib import URIRef

from geo_cli.etl._feature_transformer import _FeatureTransformer
from geo_cli.model.feature import Feature
from geo_cli.model.frequency_range import FrequencyRange
from geo_cli.model.geometry import Geometry
from geo_cli.namespace import TWXPLORE_GEO_APP_ONTOLOGY
from geo_cli.path import ROOT_DIR_PATH


class DsaRequestFeatureTransformer(_FeatureTransformer):
    def transform(self, **kwds) -> Generator[Feature, None, None]:
        requests_json_file_path = (ROOT_DIR_PATH / ".." / "DynamicSpectrumAccess" / "ontologies" / "requests.json").absolute()
        with open(requests_json_file_path) as requests_json_file:
            request_json_objects = json.load(requests_json_file)
            for request_json_object in request_json_objects:
                location_json_object = request_json_object["location"]
                yield \
                    Feature(
                        frequency_range=FrequencyRange(
                            maxInclusive=request_json_object["frequencyRange"]["maximum"],
                            minInclusive=request_json_object["frequencyRange"]["minimum"]
                        ),
                        geometry=Geometry(
                            uri=URIRef(location_json_object["geometry"]["id"]),
                            wkt=location_json_object["geometry"]["wkt"]
                        ),
                        label=request_json_object["id"],
                        type=TWXPLORE_GEO_APP_ONTOLOGY.Transmission,
                        uri=URIRef("http://purl.org/twc/dsa/request/" + request_json_object["id"])
                    )
