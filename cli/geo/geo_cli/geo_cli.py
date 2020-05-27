import argparse
import logging
from typing import Optional, Generator, Tuple, List, Union

from geo_cli.etl.pipeline.dsa.dsa_pipeline import DsaPipeline
from geo_cli.etl.pipeline.osn.osn_pipeline import OsnPipeline
from geo_cli.etl.pipeline.reverse_beacon.reverse_beacon_pipeline import ReverseBeaconPipeline
from geo_cli.etl.pipeline.tiger_line.tiger_line_pipeline import TigerLinePipeline
from geo_cli.etl.pipeline.uls.uls_pipeline import UlsPipeline
from geo_cli.model.feature import Feature


class GeoCli:
    __PIPELINES = (
        DsaPipeline(),
        OsnPipeline(),
        ReverseBeaconPipeline(),
        TigerLinePipeline(),
        UlsPipeline(),
    )
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
