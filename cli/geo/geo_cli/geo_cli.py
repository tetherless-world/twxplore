import os.path

from rdflib import Graph

from .tiger_line_zip_file import TigerLineZipFile

DATA_DIR_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "geo"))




def main():
    feature_graph = Graph()
    for file_base_name in ("tl_2018_us_mil",):
        with TigerLineZipFile(os.path.join(DATA_DIR_PATH, file_base_name + ".zip")) as tiger_line_zip_file:
            for feature in tiger_line_zip_file.extract_features():
                feature.to_rdf(feature_graph)
                break
    feature_graph.serialize(format="ttl")
