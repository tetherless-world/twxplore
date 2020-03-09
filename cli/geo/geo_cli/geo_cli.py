import os.path
import subprocess
from pathlib import Path

from rdflib import Graph

from .tiger_line.mil_tiger_line_shapefile_record import MilTigerLineShapefileRecord
from .tiger_line.state_tiger_line_shapefile_record import StateTigerLineShapefileRecord
from .tiger_line.tiger_line_zip_file import TigerLineZipFile

DATA_DIR_PATH = Path(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "geo")))




def main():
    feature_graph = Graph()
    for year in ("2019",):
        for type_str, shapefile_record_type in (
                ("mil", MilTigerLineShapefileRecord),
                ("state", StateTigerLineShapefileRecord),
        ):
            file_base_name = "tl_%(year)s_us_%(type_str)s" % locals()
            with TigerLineZipFile(zip_file_path=DATA_DIR_PATH / (file_base_name + ".zip"), shapefile_record_type=shapefile_record_type) as tiger_line_zip_file:
                for feature in tiger_line_zip_file.extract_features():
                    feature.to_rdf(feature_graph)
    features_ttl_file_path = str(DATA_DIR_PATH / "features.ttl")
    feature_graph.serialize(destination=features_ttl_file_path, format="ttl")
    subprocess.call(["bzip2", "-9", features_ttl_file_path])
