import argparse
import logging
from typing import Optional, Generator, Tuple, List, Union

from geo_cli.etl.pipeline.dsa.dsa_pipeline import DsaPipeline
from geo_cli.etl.pipeline.reverse_beacon.reverse_beacon_pipeline import ReverseBeaconPipeline
from geo_cli.etl.pipeline.tiger_line.tiger_line_pipeline import TigerLinePipeline
from geo_cli.etl.pipeline.uls.uls_pipeline import UlsPipeline
from geo_cli.model.feature import Feature


class GeoCli:
    __PIPELINES = {
        DsaPipeline(),
        ReverseBeaconPipeline(),
        TigerLinePipeline(),
        UlsPipeline()
    }
    __PIPELINES_BY_ID = {pipeline.id: pipeline for pipeline in __PIPELINES}

    def __init__(
            self, *,
            debug: Optional[bool],
            exclude_pipeline_ids: Optional[List[str]],
            features_per_pipeline: Optional[int],
            include_pipeline_ids: Optional[List[str]]
     ):
        self.__exclude_pipeline_ids = exclude_pipeline_ids
        self.__debug = debug
        self.__features_per_pipeline = features_per_pipeline
        self.__include_pipeline_ids = include_pipeline_ids
        self.__logger = logging.getLogger(__name__)

    # def _etl_dsa(self):
    #     with FileRdfFeatureLoader(DATA_DIR_PATH / "loaded" / "dsa" / "features.ttl") as loader:
    #         loader.load(DsaPolicyFeatureTransformer().transform())
    #         loader.load(DsaRequestFeatureTransformer().transform())
    #
    # def _etl_reverse_beacon(self):
    #     uls_entities_json_file_path = UlsRecordsJsonFileLoader.loaded_file_path("l_amat_entities")
    #     if not os.path.isfile(uls_entities_json_file_path):
    #         self.__logger.info("transforming ULS entities")
    #         with UlsRecordsJsonFileLoader("l_amat_entities") as loader:
    #             for transformer in (
    #                 UlsRecordTransformer(record_format=UlsRecordFormat.EN, zip_file_base_name="l_amat"),
    #             ):
    #                 loader.load(transformer.transform())
    #         self.__logger.info("transformed ULS entities and wrote to disk")
    #     self.__logger.info("loading ULS entities from %s", uls_entities_json_file_path)
    #     with open(uls_entities_json_file_path) as json_file:
    #         uls_entities_by_call_sign = json.load(json_file)
    #     self.__logger.info("loaded ULS entities from %s", uls_entities_json_file_path)
    #
    #     self.__logger.info("transforming and loading Reverse Beacon data")
    #     with FileRdfFeatureLoader(DATA_DIR_PATH / "loaded" / "reverse_beacon" / "features.ttl") as rdf_file_loader:
    #         with RequestJsonFeatureLoader(DATA_DIR_PATH / "loaded" / "reverse_beacon" / "requests.json") as request_json_loader:
    #             features = tuple(self.__limit_features_per_pipeline(ReverseBeaconFeatureTransformer(uls_entities_by_call_sign=uls_entities_by_call_sign).transform()))
    #             rdf_file_loader.load(features)
    #             request_json_loader.load(features)
    #     self.__logger.info("transformed and loaded Reverse Beacon data")

    # def _etl_tiger_line(self):
    #     self.__logger.info("transforming and loading TIGER/Line data")
    #     with FileRdfFeatureLoader(DATA_DIR_PATH / "loaded" / "tiger_line" / "features.ttl") as loader:
    #         loader.load(self.__limit_features_per_pipeline(TigerLineFeatureTransformer().transform()))
    #     self.__logger.info("transformed and loaded TIGER/Line data")

    # def _etl_uls(self):
    #     self.__logger.info("transforming and loading ULS data")
    #     with FileRdfFeatureLoader(DATA_DIR_PATH / "loaded" / "uls" / "features.ttl") as loader:
    #         loader.load(self.__limit_features_per_pipeline(UlsCellFeatureTransformer().transform()))
    #     self.__logger.info("transformed and loaded ULS data")

    def __limit_features_per_pipeline(self, features: Generator[Feature, None, None]) -> Union[Generator[Feature, None, None], Tuple[Feature, ...]]:
        if self.__features_per_pipeline is None:
            return features
        limited_features = []
        for feature in features:
            limited_features.append(feature)
            if len(limited_features) >= self.__features_per_pipeline:
                break
        return tuple(limited_features)

    @classmethod
    def main(cls):
        argument_parser = argparse.ArgumentParser()
        argument_parser.add_argument("--debug", action="store_true")
        argument_parser.add_argument("-i", "--include", action="append", dest="include_pipeline_ids", help="include a data source in ETL")
        argument_parser.add_argument("-e", "--exclude", action="append", dest="exclude_pipeline_ids", help="exclude a data source from ETL")
        argument_parser.add_argument("-l", "--features-per-pipeline", type=int)

        args = argument_parser.parse_args()

        cls(**args.__dict__).__main()

    def __main(self):
        logging.basicConfig(format="%(asctime)-15s %(levelname)s %(message)s", level=logging.DEBUG if self.__debug else logging.INFO)

        pipeline_ids = set()
        if self.__include_pipeline_ids is not None:
            for include_pipeline_id in self.__include_pipeline_ids:
                if include_pipeline_id not in self.__PIPELINES_BY_ID:
                    raise ValueError("unknown pipeline: " + include_pipeline_id)
                pipeline_ids.add(include_pipeline_id)
        if not pipeline_ids:
            pipeline_ids = set(self.__PIPELINES_BY_ID.keys())
        if self.__exclude_pipeline_ids is not None:
            for exclude_pipeline_id in self.__exclude_pipeline_ids:
                if exclude_pipeline_id not in self.__PIPELINES_BY_ID:
                    raise ValueError("unknown pipeline: " + exclude_pipeline_id)
            try:
                pipeline_ids.remove(exclude_pipeline_id)
            except KeyError:
                pass

        for pipeline_id in pipeline_ids:
            pipeline = self.__PIPELINES_BY_ID[pipeline_id]

            extract_kwds = pipeline.extractor.extract()
            features = self.__limit_features_per_pipeline(pipeline.transformer.transform(**extract_kwds))
            with pipeline.loader as loader:
                loader.load(features)

if __name__ == '__main__':
    GeoCli.main()
