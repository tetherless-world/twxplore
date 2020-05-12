from datetime import datetime

from geo_cli.etl._feature_transformer import _FeatureTransformer
from geo_cli.path import ROOT_DIR_PATH


class _DsaFeatureTransformer(_FeatureTransformer):
    _DSA_ONTOLOGIES_DIR_PATH = (ROOT_DIR_PATH / ".." / "DynamicSpectrumAccess" / "ontologies").absolute()

    @staticmethod
    def _parse_datetime(value: str) -> datetime:
        assert value.endswith("Z[GMT]"), value
        value = value[:-len("Z[GMT]")]
        value += "+00:00"
        return datetime.fromisoformat(value)
