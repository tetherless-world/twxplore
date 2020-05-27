from datetime import date

from geo_cli.etl._pipeline import _Pipeline
from geo_cli.etl.pipeline.osn.osn_extractor import OsnExtractor
from geo_cli.etl.pipeline.osn.osn_feature_transformer import OsnFeatureTransformer


class OsnPipeline(_Pipeline):
    def __init__(self):
        _Pipeline.__init__(
            self,
            extractor=OsnExtractor(days=(date(year=2020, month=5, day=25),)),
            transformer=OsnFeatureTransformer(),
            id="osn"
        )
