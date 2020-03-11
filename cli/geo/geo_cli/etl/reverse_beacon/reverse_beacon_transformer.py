import csv
import logging
import os
from io import TextIOWrapper
from typing import Generator, Dict
from zipfile import ZipFile

from geo_cli.etl._transformer import _Transformer
from geo_cli.geocoder import Geocoder
from geo_cli.model.feature import Feature
from geo_cli.model.geometry import Geometry
from geo_cli.model.uls_entity import UlsEntity
from geo_cli.namespace import TWXPLORE_GEO_APP_GEOMETRY, TWXPLORE_GEO_APP_FEATURE, TWXPLORE_GEO_APP_ONTOLOGY
from geo_cli.path import DATA_DIR_PATH


class ReverseBeaconTransformer(_Transformer):
    def __init__(self, uls_entities_by_call_sign: Dict[str, Dict[str, object]]):
        self.__geocoder = Geocoder()
        self.__logger = logging.getLogger(self.__class__.__name__)
        self.__uls_entities_by_call_sign = uls_entities_by_call_sign

    def transform(self, **kwds) -> Generator[Feature, None, None]:
        extracted_data_dir_path = DATA_DIR_PATH / "extracted" / "reverse_beacon"
        duplicate_call_sign_count = 0
        missing_uls_entity_count = 0
        yielded_feature_count = 0
        for file_name in sorted(os.listdir(extracted_data_dir_path)):
            if not file_name.endswith(".zip"):
                continue
            zip_file_path = extracted_data_dir_path / file_name
            if not os.path.isfile(zip_file_path):
                continue
            file_base_name = os.path.splitext(file_name)[0]
            yielded_call_signs = set()
            self.__logger.info("transforming file %s", zip_file_path)
            with ZipFile(zip_file_path) as zip_file:
                with zip_file.open(file_base_name + ".csv") as csv_file:
                    csv_reader = csv.DictReader(TextIOWrapper(csv_file, "utf-8"))
                    for row in csv_reader:
                        if row["de_cont"] != "NA":
                            continue
                        call_sign = row["callsign"]
                        if call_sign in yielded_call_signs:
                            duplicate_call_sign_count += 1
                            continue
                        try:
                            uls_entity = UlsEntity(**self.__uls_entities_by_call_sign[call_sign])
                        except KeyError:
                            missing_uls_entity_count += 1
                            continue
                        address = f"{uls_entity.street_address}, {uls_entity.city}, {uls_entity.state} {uls_entity.zip_code}"
                        wkt = self.__geocoder.geocode(address)
                        geometry = \
                            Geometry(
                                uri=TWXPLORE_GEO_APP_GEOMETRY[f"uls-{uls_entity.unique_system_identifier}"],
                                wkt=wkt
                            )
                        feature = \
                            Feature(
                                label=uls_entity.call_sign + ": " + uls_entity.name,
                                geometry=geometry,
                                type=TWXPLORE_GEO_APP_ONTOLOGY.UlsEntity,
                                uri=TWXPLORE_GEO_APP_FEATURE[f"uls-{uls_entity.unique_system_identifier}"]
                            )
                        yield feature
                        yielded_call_signs.add(call_sign)
                        yielded_feature_count += 1
            self.__logger.info("transformed file %s", zip_file_path)
            self.__logger.info("duplicate call signs: %d, missing ULS entities: %d, yielded features: %d", duplicate_call_sign_count, missing_uls_entity_count, yielded_feature_count)
