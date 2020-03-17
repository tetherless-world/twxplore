import csv
import os
from datetime import datetime, timezone
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
        _Transformer.__init__(self)
        self.__geocoder = Geocoder()
        self.__uls_entities_by_call_sign = uls_entities_by_call_sign

    def transform(self, **kwds) -> Generator[Feature, None, None]:
        extracted_data_dir_path = DATA_DIR_PATH / "extracted" / "reverse_beacon"
        duplicate_transmission_count = 0
        geocode_failure_count = 0
        missing_uls_entity_count = 0
        skipped_uls_entity_count = 0
        yielded_feature_count = 0
        # Accumulate rows by call sign to get the one with the highest "db" / signal-to-noise ratio
        for file_name in sorted(os.listdir(extracted_data_dir_path)):
            if not file_name.endswith(".zip"):
                continue
            zip_file_path = extracted_data_dir_path / file_name
            if not os.path.isfile(zip_file_path):
                continue
            file_base_name = os.path.splitext(file_name)[0]
            self._logger.info("transforming file %s", zip_file_path)
            unique_rows = {}
            with ZipFile(zip_file_path) as zip_file:
                with zip_file.open(file_base_name + ".csv") as csv_file:
                    csv_reader = csv.DictReader(TextIOWrapper(csv_file, "utf-8"))
                    for row in csv_reader:
                        # if row_i > 0 and row_i % 10000 == 0:
                        #     self._logger.info("processed %d rows from %s", row_i, zip_file_path)
                        # DX is the spotted station
                        # DE is the spotting station
                        if row["dx_cont"] != "NA":
                            # Exclude everything outside North America
                            continue
                        dx_call_sign = row["dx"]
                        try:
                            uls_entity = UlsEntity(**self.__uls_entities_by_call_sign[dx_call_sign])
                        except KeyError:
                            missing_uls_entity_count += 1
                            continue
                        if uls_entity.state != "NY":
                            skipped_uls_entity_count += 1
                            continue
                        # Observed attributes that don't change between spotters, unlike speed and snr/db
                        row_signature = "%(dx)s-%(freq)s-%(band)s-%(mode)s-%(tx_mode)s" % row
                        # Store the timestamp for time deltas
                        row["timestamp"] = datetime.strptime(row["date"], "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc) # 2020-02-01 00:00:00
                        unique_rows_for_signature = unique_rows.setdefault(row_signature, [])
                        row_is_unique = True
                        for unique_row in unique_rows_for_signature:
                            delta = abs(unique_row["timestamp"] - row["timestamp"])
                            if delta.seconds < 120:
                                # Rows are probably referring to the same transmission, received at different times by different spotters.
                                row_is_unique = False
                                break
                        if not row_is_unique:
                            duplicate_transmission_count += 1
                            continue
                        unique_rows_for_signature.append(row)

            for row_i, rows in enumerate(unique_rows.values()):
                # Use the row with the highest signal-to-noise ratio
                row = max(rows, key=lambda row: row["db"])

                uls_entity = UlsEntity(**self.__uls_entities_by_call_sign[row["dx"]])
                address = f"{uls_entity.street_address}, {uls_entity.city}, {uls_entity.state} {uls_entity.zip_code}"
                try:
                    wkt = self.__geocoder.geocode(address)
                except LookupError:
                    geocode_failure_count += 1
                    continue
                geometry = \
                    Geometry(
                        uri=TWXPLORE_GEO_APP_GEOMETRY[f"uls-{uls_entity.unique_system_identifier}"],
                        wkt=wkt
                    )
                feature = \
                    Feature(
                        frequency=float(row["freq"]),
                        label="Transmission: %s (%s) @ %s on frequency %s" % (uls_entity.call_sign, uls_entity.name, row["date"], row["freq"]),
                        geometry=geometry,
                        timestamp=row["timestamp"],
                        transmission_power=int(row["db"]),
                        type=TWXPLORE_GEO_APP_ONTOLOGY.Transmission,
                        uri=TWXPLORE_GEO_APP_FEATURE[f"reverse-beacon-{file_base_name}-{row_i}"]
                    )
                yield feature
                yielded_feature_count += 1

            self._logger.info("transformed file %s", zip_file_path)
            self._logger.info("duplicate transmissions: %d, missing ULS entities: %d, skipped ULS entities: %d, geocode failures: %d, yielded features: %d", duplicate_transmission_count, missing_uls_entity_count, skipped_uls_entity_count, geocode_failure_count, yielded_feature_count)
            # break
