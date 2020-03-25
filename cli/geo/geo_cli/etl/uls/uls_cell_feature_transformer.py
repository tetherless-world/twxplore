from datetime import datetime
from typing import Dict
from zipfile import ZipFile

from geo_cli.etl._feature_transformer import _FeatureTransformer
from geo_cli.etl.tiger_line.states import STATE_NAMES_BY_ABBREVIATION, STATE_NAMES
from geo_cli.etl.uls.uls_record_transformer import UlsRecordTransformer
from geo_cli.model.feature import Feature
from geo_cli.model.geometry import Geometry
from geo_cli.model.uls_record import UlsRecord
from geo_cli.model.uls_record_format import UlsRecordFormat
from geo_cli.namespace import TWXPLORE_GEO_APP_ONTOLOGY, TWXPLORE_GEO_APP_FEATURE, TWXPLORE_GEO_APP_GEOMETRY
from geo_cli.path import DATA_DIR_PATH


class UlsCellFeatureTransformer(_FeatureTransformer):
    def transform(self):
        def degrees_minutes_seconds_to_decimal_degrees(*, degrees: int, minutes: int, seconds: float, direction: str) -> float:
            decimal_degrees = float(degrees) + float(minutes)/60.0 + float(seconds)/(60.0*60.0)
            if direction == 'W' or direction == 'S':
                decimal_degrees *= -1
            return decimal_degrees

        # Antennas are features, regardless of how many call signs they support.

        datetime_now = datetime.now()
        missing_antenna_uls_record_count = 0
        missing_location_uls_record_count = 0
        missing_geometry_count = 0
        location_geometries = {}
        yielded_feature_count = 0
        with ZipFile(DATA_DIR_PATH / "extracted" / "uls" / "l_cell.zip") as zip_file:
            antenna_uls_records = self.__map_antenna_uls_records(zip_file)
            header_uls_records = self.__map_header_uls_records(zip_file)
            location_uls_records = self.__map_location_uls_records(zip_file)

            for frequency_uls_record in UlsRecordTransformer(record_format=UlsRecordFormat.FR, zip_file=zip_file).transform():
                antenna_number = int(frequency_uls_record["Antenna Number"])
                call_sign = frequency_uls_record["Call Sign"]
                location_number = int(frequency_uls_record["Location Number"])

                header_uls_record = header_uls_records[call_sign]
                cancellation_date = header_uls_record.get("Cancellation Date")
                if cancellation_date is not None:
                    continue
                expired_date = datetime.strptime(header_uls_record.get("Expired Date"), "%m/%d/%Y")
                if expired_date <= datetime_now:
                    continue

                try:
                    antenna_uls_record = antenna_uls_records[call_sign][location_number][antenna_number]
                except KeyError:
                    missing_antenna_uls_record_count += 1
                    continue
                # Antenna has maximum ERP, which is related to transmission power but does not losses from the transmission line.
                # https://en.wikipedia.org/wiki/Effective_radiated_power#Relation_to_transmitter_output_power

                try:
                    location_uls_record = location_uls_records[call_sign][location_number]
                except KeyError:
                    missing_location_uls_record_count += 1
                    continue

                try:
                    latitude = \
                        degrees_minutes_seconds_to_decimal_degrees(
                            degrees=int(location_uls_record["Latitude Degrees"]),
                            minutes=int(location_uls_record["Latitude Minutes"]),
                            seconds=float(location_uls_record["Latitude Seconds"]),
                            direction=location_uls_record["Latitude Direction"]
                        )
                    longitude = \
                        degrees_minutes_seconds_to_decimal_degrees(
                            degrees=int(location_uls_record["Longitude Degrees"]),
                            minutes=int(location_uls_record["Longitude Minutes"]),
                            seconds=float(location_uls_record["LongitudeSeconds"]),
                            direction=location_uls_record["Longitude Direction"]
                        )
                except KeyError:
                    missing_geometry_count += 1
                    continue
                location_key = f"{longitude:.4f}x{latitude:.4f}"
                try:
                    location_geometry = location_geometries[location_key]
                except KeyError:
                    location_geometry = \
                        Geometry(
                            uri=TWXPLORE_GEO_APP_GEOMETRY[f"uls-location-{location_key}"],
                            wkt=f"POINT ({longitude:.4f} {latitude:.4f})"
                        )
                    location_geometries[location_key] = location_geometry

                frequency = float(frequency_uls_record["Frequency Assigned"])

                state = location_uls_record["Location State"]
                try:
                    state_name = STATE_NAMES_BY_ABBREVIATION[state]
                except KeyError:
                    if state in STATE_NAMES:
                        state_name = state
                    elif state == "GM":
                        state_name = "Guam"
                    else:
                        state_name = None
                        self._logger.warning("unknown state: %s", state)

                antenna_key = f"{call_sign}-{location_number}-{antenna_number}"

                antenna_feature = \
                    Feature(
                        label="Cellular antenna: %s" % (antenna_key,),
                        frequency=frequency,
                        geometry=location_geometry,
                        locality=location_uls_record.get('Location City'),
                        regions=(state_name,) if state_name else None,
                        type=TWXPLORE_GEO_APP_ONTOLOGY.Transmitter,
                        uri=TWXPLORE_GEO_APP_FEATURE[f"uls-cell-antenna-{antenna_key}"]
                    )
                yield antenna_feature
                yielded_feature_count += 1
                if yielded_feature_count % 1000 == 0:
                    self._logger.info("yielded %d features from cellular data, with %d missing antenna records, %d missing location records, and %d missing geometries", yielded_feature_count, missing_antenna_uls_record_count, missing_location_uls_record_count, missing_geometry_count)
                    return
        self._logger.info("yielded %d features from cellular data, with %d missing antenna records, %d missing location records, and %d missing geometries", yielded_feature_count, missing_antenna_uls_record_count, missing_location_uls_record_count, missing_geometry_count)

    def __map_antenna_uls_records(self, zip_file: ZipFile) -> Dict[str, Dict[int, Dict[int, UlsRecord]]]: # Call sign -> location number -> antenna number -> record
        antenna_uls_records = {}
        antenna_ids = set()
        duplicate_combination_count = 0
        for antenna_uls_record in UlsRecordTransformer(record_format=UlsRecordFormat.AN, zip_file=zip_file).transform():
            antenna_number = int(antenna_uls_record["Antenna Number"])
            call_sign = antenna_uls_record["Call Sign"]
            location_number = int(antenna_uls_record["Location Number"])
            unique_system_identifier = antenna_uls_record["Unique System Identifier"]
            antenna_ids.add(unique_system_identifier)
            # print(call_sign, location_number, antenna_number)
            call_sign_antenna_uls_records = antenna_uls_records.setdefault(call_sign, {})
            location_antenna_uls_records = call_sign_antenna_uls_records.setdefault(location_number, {})
            if antenna_number in location_antenna_uls_records:
                duplicate_combination_count += 1
                # print("Duplicate")
            # assert antenna_number not in location_antenna_uls_records
            location_antenna_uls_records[antenna_number] = antenna_uls_record
        # 4 duplicates in current records, just ignore rather than try to resolve
        # print("Duplicate antenna combinations:", duplicate_combination_count)
        return antenna_uls_records

    def __map_header_uls_records(self, zip_file: ZipFile) -> Dict[str, UlsRecord]: # Call sign -> record
        header_uls_records = {}
        for header_uls_record in UlsRecordTransformer(record_format=UlsRecordFormat.HD, zip_file=zip_file).transform():
            call_sign = header_uls_record["Call Sign"]
            assert call_sign not in header_uls_records
            header_uls_records[call_sign] = header_uls_record
        return header_uls_records

    def __map_location_uls_records(self, zip_file: ZipFile) -> Dict[str, Dict[int, UlsRecord]]: # Call sign -> location number -> record
        location_uls_records = {}
        for location_uls_record in UlsRecordTransformer(record_format=UlsRecordFormat.LO, zip_file=zip_file).transform():
            call_sign = location_uls_record["Call Sign"]
            location_number = int(location_uls_record["Location Number"])
            call_sign_location_uls_records = location_uls_records.setdefault(call_sign, {})
            assert location_number not in call_sign_location_uls_records
            call_sign_location_uls_records[location_number] = location_uls_record
        return location_uls_records
