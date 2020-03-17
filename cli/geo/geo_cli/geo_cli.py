import json
import logging
import os.path

from geo_cli.etl.rdf_file_loader import RdfFileLoader
from geo_cli.etl.request_json_loader import RequestJsonLoader
from geo_cli.etl.reverse_beacon.reverse_beacon_transformer import ReverseBeaconTransformer
from geo_cli.etl.uls.uls_entities_json_file_loader import UlsEntitiesJsonFileLoader
from geo_cli.etl.uls.uls_entities_transformer import UlsEntitiesTransformer
from geo_cli.path import DATA_DIR_PATH


def main():
    logging.basicConfig(format="%(asctime)-15s %(message)s", level=logging.INFO)
    logger = logging.getLogger(__name__)

    if not os.path.isfile(UlsEntitiesJsonFileLoader.ULS_ENTITIES_BY_CALL_SIGN_JSON_FILE_PATH):
        logger.info("transforming ULS entities")
        with UlsEntitiesJsonFileLoader() as loader:
            for transformer in (
                    UlsEntitiesTransformer("l_amat"),
            ):
                loader.load(transformer.transform())
        logger.info("transformed ULS entities and wrote to disk")
    logger.info("loading ULS entities from disk")
    with open(UlsEntitiesJsonFileLoader.ULS_ENTITIES_BY_CALL_SIGN_JSON_FILE_PATH) as json_file:
        uls_entities_by_call_sign = json.load(json_file)
    logger.info("loaded ULS entities from disk")

    logger.info("transforming and loading Reverse Beacon data")
    with RdfFileLoader(DATA_DIR_PATH / "loaded" / "reverse_beacon" / "features.ttl") as rdf_file_loader:
        with RequestJsonLoader(DATA_DIR_PATH / "loaded" / "reverse_beacon" / "requests.json") as request_json_loader:
            features = tuple(ReverseBeaconTransformer(uls_entities_by_call_sign=uls_entities_by_call_sign).transform())
            rdf_file_loader.load(features)
            request_json_loader.load(features)
    logger.info("transformed and loaded Reverse Beacon data")

if __name__ == '__main__':
    main()
