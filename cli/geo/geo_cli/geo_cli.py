import argparse
import json
import logging
import os.path
from typing import Optional, Generator, Tuple, List, Union

from geo_cli.etl.dsa.dsa_policy_feature_transformer import DsaPolicyFeatureTransformer
from geo_cli.etl.dsa.dsa_request_feature_transformer import DsaRequestFeatureTransformer
from geo_cli.etl.file_rdf_feature_loader import FileRdfFeatureLoader
from geo_cli.etl.request_json_feature_loader import RequestJsonFeatureLoader
from geo_cli.etl.reverse_beacon.reverse_beacon_feature_transformer import ReverseBeaconFeatureTransformer
from geo_cli.etl.tiger_line.tiger_line_feature_transformer import TigerLineFeatureTransformer
from geo_cli.etl.uls.uls_cell_feature_transformer import UlsCellFeatureTransformer
from geo_cli.etl.uls.uls_record_transformer import UlsRecordTransformer
from geo_cli.etl.uls.uls_records_json_file_loader import UlsRecordsJsonFileLoader
from geo_cli.model.feature import Feature
from geo_cli.model.uls_record_format import UlsRecordFormat
from geo_cli.path import DATA_DIR_PATH


class GeoCli:
    __DATA_SOURCE_NAMES = {"dsa", "reverse_beacon", "tiger_line", "uls"}

    def __init__(
            self, *,
            debug: Optional[bool],
            exclude_data_source_names: Optional[List[str]],
            features_per_data_source: Optional[int],
            include_data_source_names: Optional[List[str]]
     ):
        self.__exclude_data_source_names = exclude_data_source_names
        self.__debug = debug
        self.__features_per_data_source = features_per_data_source
        self.__include_data_source_names = include_data_source_names
        self.__logger = logging.getLogger(__name__)

    def _etl_dsa(self):
        with FileRdfFeatureLoader(DATA_DIR_PATH / "loaded" / "dsa" / "features.ttl") as loader:
            loader.load(DsaPolicyFeatureTransformer().transform())
            loader.load(DsaRequestFeatureTransformer().transform())

    def _etl_reverse_beacon(self):
        uls_entities_json_file_path = UlsRecordsJsonFileLoader.loaded_file_path("l_amat_entities")
        if not os.path.isfile(uls_entities_json_file_path):
            self.__logger.info("transforming ULS entities")
            with UlsRecordsJsonFileLoader("l_amat_entities") as loader:
                for transformer in (
                    UlsRecordTransformer(record_format=UlsRecordFormat.EN, zip_file_base_name="l_amat"),
                ):
                    loader.load(transformer.transform())
            self.__logger.info("transformed ULS entities and wrote to disk")
        self.__logger.info("loading ULS entities from %s", uls_entities_json_file_path)
        with open(uls_entities_json_file_path) as json_file:
            uls_entities_by_call_sign = json.load(json_file)
        self.__logger.info("loaded ULS entities from %s", uls_entities_json_file_path)

        self.__logger.info("transforming and loading Reverse Beacon data")
        with FileRdfFeatureLoader(DATA_DIR_PATH / "loaded" / "reverse_beacon" / "features.ttl") as rdf_file_loader:
            with RequestJsonFeatureLoader(DATA_DIR_PATH / "loaded" / "reverse_beacon" / "requests.json") as request_json_loader:
                features = tuple(self.__limit_features_per_data_source(ReverseBeaconFeatureTransformer(uls_entities_by_call_sign=uls_entities_by_call_sign).transform()))
                rdf_file_loader.load(features)
                request_json_loader.load(features)
        self.__logger.info("transformed and loaded Reverse Beacon data")

    def _etl_tiger_line(self):
        self.__logger.info("transforming and loading TIGER/Line data")
        with FileRdfFeatureLoader(DATA_DIR_PATH / "loaded" / "tiger_line" / "features.ttl") as loader:
            loader.load(self.__limit_features_per_data_source(TigerLineFeatureTransformer().transform()))
        self.__logger.info("transformed and loaded TIGER/Line data")

    def _etl_uls(self):
        self.__logger.info("transforming and loading ULS data")
        with FileRdfFeatureLoader(DATA_DIR_PATH / "loaded" / "uls" / "features.ttl") as loader:
            loader.load(self.__limit_features_per_data_source(UlsCellFeatureTransformer().transform()))
        self.__logger.info("transformed and loaded ULS data")

    def __limit_features_per_data_source(self, features: Generator[Feature, None, None]) -> Union[Generator[Feature, None, None], Tuple[Feature, ...]]:
        if self.__features_per_data_source is None:
            return features
        limited_features = []
        for feature in features:
            limited_features.append(feature)
            if len(limited_features) >= self.__features_per_data_source:
                break
        return tuple(limited_features)

    @classmethod
    def main(cls):
        argument_parser = argparse.ArgumentParser()
        argument_parser.add_argument("--debug", action="store_true")
        argument_parser.add_argument("--include", action="append", dest="include_data_source_names", help="include a data source in ETL")
        argument_parser.add_argument("--exclude", action="append", dest="exclude_data_source_names", help="exclude a data source from ETL")
        argument_parser.add_argument("--features-per-data-source", type=int)

        args = argument_parser.parse_args()

        cls(**args.__dict__).__main()

    def __main(self):
        logging.basicConfig(format="%(asctime)-15s %(levelname)s %(message)s", level=logging.DEBUG if self.__debug else logging.INFO)

        data_source_names = set()
        if self.__include_data_source_names is not None:
            for include_data_source_name in self.__include_data_source_names:
                if include_data_source_name not in self.__DATA_SOURCE_NAMES:
                    raise ValueError("unknown data source: " + include_data_source_name)
                data_source_names.add(include_data_source_name)
        if not data_source_names:
            data_source_names = self.__DATA_SOURCE_NAMES.copy()
        if self.__exclude_data_source_names is not None:
            for exclude_data_source_name in self.__exclude_data_source_names:
                if exclude_data_source_name not in self.__DATA_SOURCE_NAMES:
                    raise ValueError("unknown data source: " + exclude_data_source_name)
            try:
                data_source_names.remove(exclude_data_source_name)
            except KeyError:
                pass

        for data_source_name in data_source_names:
            getattr(self, "_etl_" + data_source_name)()

if __name__ == '__main__':
    GeoCli.main()
