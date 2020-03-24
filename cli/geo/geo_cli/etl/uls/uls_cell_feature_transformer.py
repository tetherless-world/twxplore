from zipfile import ZipFile

from geo_cli.etl._feature_transformer import _FeatureTransformer
from geo_cli.path import DATA_DIR_PATH


class UlsCellFeatureTransformer(_FeatureTransformer):
    def transform(self):
        with ZipFile(DATA_DIR_PATH / "extracted" / "uls" / "l_cell.zip") as zip_file:
            for antenna in self._transform_antennae():
                print(antenna)

