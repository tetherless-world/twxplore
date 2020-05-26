from geo_cli.etl._pipeline import _Pipeline
from geo_cli.etl.pipeline.tiger_line.tiger_line_feature_transformer import TigerLineFeatureTransformer
from geo_cli.etl.pipeline.uls.uls_cell_feature_transformer import UlsCellFeatureTransformer


class UlsPipeline(_Pipeline):
    def __init__(self):
        _Pipeline.__init__(
            self,
            id="uls",
            transformer=UlsCellFeatureTransformer()
        )
