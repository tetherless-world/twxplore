import os.path
from pathlib import Path

from rdflib import Graph

from .tiger_line_zip_file import TigerLineZipFile

DATA_DIR_PATH = Path(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "geo")))




def main():
    feature_graph = Graph()
    for tiger_line_year in ("2019",):
        for tiger_line_type in ("mil", "state",):
            file_base_name = "tl_%(tiger_line_year)s_us_%(tiger_line_type)s" % locals()
            with TigerLineZipFile(zip_file_path=DATA_DIR_PATH / (file_base_name + ".zip"), type=tiger_line_type) as tiger_line_zip_file:
                for feature in tiger_line_zip_file.extract_features():
                    feature.to_rdf(feature_graph)
    feature_graph.serialize(destination=str(DATA_DIR_PATH / "features.ttl"), format="ttl")
