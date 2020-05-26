from typing import Dict

from geo_cli.etl._pipeline import _Pipeline
from geo_cli.etl.pipeline.reverse_beacon.reverse_beacon_feature_loader import ReverseBeaconFeatureLoader
from geo_cli.etl.pipeline.reverse_beacon.reverse_beacon_feature_transformer import ReverseBeaconFeatureTransformer


class ReverseBeaconPipeline(_Pipeline):
    def __init__(self):
        _Pipeline.__init__(
            self,
            id="reverse_beacon",
            loader=ReverseBeaconFeatureLoader(),
            transformer=ReverseBeaconFeatureTransformer()
        )
