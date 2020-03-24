import argparse
import json
import logging
import os.path
from typing import Optional, Generator, Tuple

from geo_cli.etl.rdf_file_loader import RdfFileLoader
from geo_cli.etl.request_json_loader import RequestJsonLoader
from geo_cli.etl.reverse_beacon.reverse_beacon_transformer import ReverseBeaconTransformer
from geo_cli.etl.tiger_line.tiger_line_transformer import TigerLineTransformer
from geo_cli.etl.uls.uls_entities_json_file_loader import UlsEntitiesJsonFileLoader
from geo_cli.etl.uls.uls_entities_transformer import UlsEntitiesTransformer
from geo_cli.model.feature import Feature
from geo_cli.path import DATA_DIR_PATH


class GeoCli:
    __DATA_SOURCE_NAMES = {"reverse_beacon", "tiger_line"}

    def __init__(self):
        self.__argument_parser = argparse.ArgumentParser()
        self.__argument_parser.add_argument("--debug", action="store_true")
        self.__argument_parser.add_argument("--include", action="append", dest="include_data_source_names", help="include a data source in ETL")
        self.__argument_parser.add_argument("--exclude", action="append", dest="exclude_data_source_names", help="exclude a data source from ETL")
        self.__argument_parser.add_argument("--features-per-data-source", type=int)

    def _etl_reverse_beacon(self, features_per_data_source: Optional[int]):
        if not os.path.isfile(UlsEntitiesJsonFileLoader.ULS_ENTITIES_BY_CALL_SIGN_JSON_FILE_PATH):
            self.__logger.info("transforming ULS entities")
            with UlsEntitiesJsonFileLoader() as loader:
                for transformer in (
                        UlsEntitiesTransformer("l_amat"),
                ):
                    loader.load(transformer.transform())
            self.__logger.info("transformed ULS entities and wrote to disk")
        self.__logger.info("loading ULS entities from disk")
        with open(UlsEntitiesJsonFileLoader.ULS_ENTITIES_BY_CALL_SIGN_JSON_FILE_PATH) as json_file:
            uls_entities_by_call_sign = json.load(json_file)
        self.__logger.info("loaded ULS entities from disk")

        self.__logger.info("transforming and loading Reverse Beacon data")
        with RdfFileLoader(DATA_DIR_PATH / "loaded" / "reverse_beacon" / "features.ttl") as rdf_file_loader:
            with RequestJsonLoader(DATA_DIR_PATH / "loaded" / "reverse_beacon" / "requests.json") as request_json_loader:
                transformer = ReverseBeaconTransformer(uls_entities_by_call_sign=uls_entities_by_call_sign)
                if features_per_data_source is not None and features_per_data_source > 0:
                    features = self.__limit_features_per_data_source(features_per_data_source=features_per_data_source, features=transformer.transform())
                else:
                    features = tuple(transformer.transform())
                rdf_file_loader.load(features)
                request_json_loader.load(features)
        self.__logger.info("transformed and loaded Reverse Beacon data")

    def _etl_tiger_line(self, features_per_data_source: Optional[int]):
        self.__logger.info("transforming and loading TIGER/Line data")
        with RdfFileLoader(DATA_DIR_PATH / "loaded" / "tiger_line" / "features.ttl") as loader:
            transformer = TigerLineTransformer()
            if features_per_data_source is not None and features_per_data_source > 0:
                features = self.__limit_features_per_data_source(features_per_data_source=features_per_data_source, features=transformer.transform())
            else:
                features = transformer.transform()
            loader.load(features)
        self.__logger.info("transformed and loaded TIGER/Line data")

    def __limit_features_per_data_source(self, features: Generator[Feature, None, None], features_per_data_source: int) -> Tuple[Feature, ...]:
        limited_features = []
        for feature in features:
            limited_features.append(feature)
            if len(limited_features) >= features_per_data_source:
                break
        return tuple(limited_features)

    def main(self):
        args = self.__argument_parser.parse_args()

        logging.basicConfig(format="%(asctime)-15s %(levelname)s %(message)s", level=logging.DEBUG if args.debug else logging.INFO)
        self.__logger = logging.getLogger(__name__)

        data_source_names = set()
        if args.include_data_source_names is not None:
            for include_data_source_name in args.include_data_source_names:
                if include_data_source_name not in self.__DATA_SOURCE_NAMES:
                    raise ValueError("unknown data source: " + include_data_source_name)
                data_source_names.add(include_data_source_name)
        if not data_source_names:
            data_source_names = self.__DATA_SOURCE_NAMES.copy()
        if args.exclude_data_source_names is not None:
            for exclude_data_source_name in args.exclude_data_source_names:
                if exclude_data_source_name not in self.__DATA_SOURCE_NAMES:
                    raise ValueError("unknown data source: " + exclude_data_source_name)
            try:
                data_source_names.remove(exclude_data_source_name)
            except KeyError:
                pass

        for data_source_name in data_source_names:
            getattr(self, "_etl_" + data_source_name)(features_per_data_source=args.features_per_data_source)

if __name__ == '__main__':
    GeoCli().main()
