from geo_cli.etl._feature_transformer import _FeatureTransformer
from geo_cli.etl._pipeline import _Pipeline
from geo_cli.etl.pipeline.dsa.dsa_policy_feature_transformer import DsaPolicyFeatureTransformer
from geo_cli.etl.pipeline.dsa.dsa_request_feature_transformer import DsaRequestFeatureTransformer


class DsaPipeline(_Pipeline):
    def __init__(self):
        class DsaCombinedFeatureTransformer(_FeatureTransformer):
            def transform(self):
                yield from DsaPolicyFeatureTransformer().transform()
                yield from DsaRequestFeatureTransformer().transform()

        _Pipeline.__init__(
            self,
            id="dsa",
            transformer=DsaCombinedFeatureTransformer()
        )
