import json
import os.path

from geo_cli.etl.features_rdf_file_loader import FeaturesRdfFileLoader
from geo_cli.etl.reverse_beacon.reverse_beacon_transformer import ReverseBeaconTransformer
from geo_cli.etl.uls.uls_entities_json_file_loader import UlsEntitiesJsonFileLoader
from geo_cli.etl.uls.uls_entities_transformer import UlsEntitiesTransformer
from geo_cli.path import DATA_DIR_PATH


def main():
    if not os.path.isfile(UlsEntitiesJsonFileLoader.ULS_ENTITIES_BY_CALL_SIGN_JSON_FILE_PATH):
        with UlsEntitiesJsonFileLoader() as loader:
            for transformer in (
                    UlsEntitiesTransformer("l_amat"),
            ):
                loader.load(transformer.transform())
    with open(UlsEntitiesJsonFileLoader.ULS_ENTITIES_BY_CALL_SIGN_JSON_FILE_PATH) as json_file:
        uls_entities_by_call_sign = json.load(json_file)

    with FeaturesRdfFileLoader(DATA_DIR_PATH / "loaded" / "reverse_beacon" / "features.ttl") as loader:
        loader.load(ReverseBeaconTransformer(uls_entities_by_call_sign=uls_entities_by_call_sign).transform())

    # with FileLoader(DATA_DIR_PATH / "loaded" / "tiger_line" / "features.ttl") as loader:
    #     loader.load(TigerLineTransformer().transform())

if __name__ == '__main__':
    main()
