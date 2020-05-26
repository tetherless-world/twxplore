from geo_cli.etl._pipeline import _Pipeline
from geo_cli.etl.pipeline.tiger_line.tiger_line_feature_transformer import TigerLineFeatureTransformer


class TigerLinePipeline(_Pipeline):
    def __init__(self):
        _Pipeline.__init__(
            self,
            id="tiger_line",
            transformer=TigerLineFeatureTransformer()
        )
