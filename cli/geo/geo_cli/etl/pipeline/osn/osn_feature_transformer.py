import csv
import gzip
from datetime import datetime
from io import TextIOWrapper
from pathlib import Path
from tempfile import TemporaryDirectory
from typing import Tuple
import tarfile
import os.path

from tqdm import tqdm

from geo_cli.etl._feature_transformer import _FeatureTransformer
from geo_cli.model.feature import Feature
from geo_cli.model.geometry import Geometry
from geo_cli.namespace import TWXPLORE_GEO_APP_GEOMETRY, TWXPLORE_GEO_APP_FEATURE


class OsnFeatureTransformer(_FeatureTransformer):
    __FLAG_VALUES = {
        "FALSE": False,
        "TRUE": True
    }

    def transform(self, *, states_csv_tar_file_paths: Tuple[Path, ...]):
        features_by_icao24 = {}
        for states_csv_tar_file_path in states_csv_tar_file_paths:
            self._logger.info("processing %s", states_csv_tar_file_path)
            with tarfile.open(states_csv_tar_file_path) as states_csv_tar_file:
                with TemporaryDirectory() as states_csv_tar_dir_path:
                    states_csv_tar_file.extractall(path=str(states_csv_tar_dir_path))
                    states_csv_gz_file_name = os.path.splitext(os.path.split(states_csv_tar_file_path)[1])[0] + ".gz"
                    with gzip.open(os.path.join(states_csv_tar_dir_path, states_csv_gz_file_name)) as states_csv_gz_file:
                        for row in tqdm(csv.DictReader(TextIOWrapper(states_csv_gz_file, encoding="ascii"))):
                            try:
                                # Column descriptions from https://opensky-network.org/datasets/states/README.txt
                                # time: This column contains the unix (aka POSIX or epoch) timestamp for which the state vector was valid.
                                # time = datetime.utcfromtimestamp(float(row["time"]))
                                # icao24: This column contains the 24-bit ICAO transponder ID which can be used to track specific airframes over different flights.
                                icao24 = row["icao24"]
                                # lat = float(row["lat"])
                                # lon = float(row["lon"])
                                # velocity: This column contains the speed over ground of the aircraft in meters per second.
                                # velocity = float(row["velocity"])
                                # heading: This column represents the direction of movement (track angle) as the clockwise angle from the geographic north.
                                # heading = float(row["heading"])
                                # vertrate: This column contains the vertical speed of the aircraft in meters per second.
                                # vertrate = float(row["vertrate"])
                                callsign = row["callsign"]
                                # onground: This flag indicates whether the aircraft is broadcasting surface positions (true) or airborne positions (false).
                                onground = self.__FLAG_VALUES[row["onground"].upper()]
                                # Ignore alert/spi
                                # squawk: This 4-digit octal number is another transponder code which is used by ATC and pilots for identification purposes and indication of emergencies.
                                # squawk = row["squawk"]
                                # baroaltitude / geoaltitude: These two columns indicate the aircraft's altitudel. As the names suggest, baroaltitude is the altitude measured by the barometer and depends on factors such as weather, whereas geoaltitude is determined using the GNSS (GPS) sensor.
                                # baroaltitude = float(row["baroaltitude"])
                                # geoaltitude = float(row["geoaltitude"])
                                # lastposupdate: This unix timestamp indicates the age of the position.
                                # lastposupdate = datetime.utcfromtimestamp(float(row["lastposupdate"]))
                                # lastcontact: This unix timestamp indicates the time at which OpenSky received the last signal of the aircraft. As long as the aircraft is flying in an airspace which is well-covered by OpenSky's receivers this timestamp should never be older than 1-2 seconds compared to the state vectors timestamp (time).
                                # OpenSky continues generating state vectors for 300 seconds after the last contact. Depending on your application, you can filter state vectors which are, e.g., older than 15 by adding a WHERE-clause to your query saying "WHERE time-lastcontact<=15". The relationship between the three timestamps explained so far is time > lastcontact >= lastposupdate.
                                lastcontact = datetime.utcfromtimestamp(float(row["lastcontact"]))
                            except ValueError:
                                continue

                            feature = \
                                Feature(
                                    # https://en.wikipedia.org/wiki/Automatic_dependent_surveillance_%E2%80%93_broadcast#Description
                                    frequency=1090.0 * 1000000.0, # 1090 MHz,
                                    geometry=Geometry(
                                        uri=TWXPLORE_GEO_APP_GEOMETRY[f"osn-geometry-{icao24}-{row['lastcontact']}"],
                                        wkt=f"POINT ({row['lon']} {row['lat']})",
                                    ),
                                    label=f"Open Sky Network: ICAO transponder={icao24}, Call sign={callsign}, {'On ground' if onground else 'Airborne'}",
                                    timestamp=lastcontact,
                                    uri=TWXPLORE_GEO_APP_FEATURE[f"osn-icao24-{icao24}"]
                                )
                            existing_feature = features_by_icao24.get(icao24)
                            if existing_feature is None:
                                features_by_icao24[icao24] = feature
                            elif feature.timestamp >= existing_feature.timestamp:
                                features_by_icao24[icao24] = feature

            self._logger.info("processed %s", states_csv_tar_file_path)

        yield from features_by_icao24.values()


