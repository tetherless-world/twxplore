import csv
import gzip
from calendar import timegm
from datetime import datetime
from io import TextIOWrapper
from pathlib import Path
from tempfile import TemporaryDirectory
from typing import Tuple, NamedTuple
import tarfile
import os.path

from tqdm import tqdm

from geo_cli.etl._feature_transformer import _FeatureTransformer
from geo_cli.model.feature import Feature
from geo_cli.model.geometry import Geometry
from geo_cli.namespace import TWXPLORE_GEO_APP_GEOMETRY, TWXPLORE_GEO_APP_FEATURE, TWXPLORE_GEO_APP_ONTOLOGY


class OsnFeatureTransformer(_FeatureTransformer):
    __FLAG_VALUES = {
        "FALSE": False,
        "TRUE": True
    }

    # https://anthonylouisdagostino.com/bounding-boxes-for-all-us-states/
    # xmin	ymin	xmax	ymax
    # New York:
    # -79.762152	40.496103	-71.856214	45.01585
    class __BoundingBox(NamedTuple):
        # x is longitude, y is latitude
        xmax: float
        xmin: float
        ymax: float
        ymin: float

        def contains(self, x: float, y: float):
            if x > self.xmax:
                return False
            if x < self.xmin:
                return False
            if y > self.ymax:
                return False
            if y < self.ymin:
                return False
            return True

    __NYS_BOUNDING_BOX = __BoundingBox(xmax = -71.856214, xmin = -79.762152, ymax = 45.01585, ymin = 40.496103)

    def transform(self, *, states_csv_tar_file_paths: Tuple[Path, ...]):
        features_by_icao24 = {}
        feature_count = 0
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
                                lat = float(row["lat"])
                                lon = float(row["lon"])
                                # velocity: This column contains the speed over ground of the aircraft in meters per second.
                                # velocity = float(row["velocity"])
                                # heading: This column represents the direction of movement (track angle) as the clockwise angle from the geographic north.
                                # heading = float(row["heading"])
                                # vertrate: This column contains the vertical speed of the aircraft in meters per second.
                                # vertrate = float(row["vertrate"])
                                callsign = row["callsign"].strip()
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

                            if not self.__NYS_BOUNDING_BOX.contains(x=lon, y=lat):
                                # self._logger.info("%.4f %.4f is not in New York State", lat, lon)
                                continue
                            # self._logger.info("%.4f %.4f is in New York State", lat, lon)

                            # https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC%2020-165.pdf
                            # https://en.wikipedia.org/wiki/Automatic_dependent_surveillance_%E2%80%93_broadcast#Description
                            # Model an ADS-B 1090ES transponder
                            feature = \
                                Feature(
                                    frequency=1090.0 * 1000000.0, # 1090 MHz,
                                    geometry=Geometry(
                                        uri=TWXPLORE_GEO_APP_GEOMETRY[f"osn-geometry-{icao24}-{row['lastcontact']}"],
                                        wkt=f"POINT ({row['lon']} {row['lat']})",
                                    ),
                                    label=f"Open Sky Network: ICAO transponder={icao24}, {'Call sign=' + callsign if callsign else ''}, {'On ground' if onground else 'Airborne'}",
                                    timestamp=lastcontact,
                                    transmission_power=27, # dBW, max of various ADS-B 1090ES systems, see faa.gov table above
                                    type=TWXPLORE_GEO_APP_ONTOLOGY.Transmission,
                                    uri=TWXPLORE_GEO_APP_FEATURE[f"osn-icao24-{icao24}"]
                                )
                            existing_features = features_by_icao24.setdefault(icao24, [])
                            if not existing_features:
                                existing_features.append(feature)
                                feature_count += 1
                                continue
                            # Add this feature to the existing features if its timestamp is > or < 30 minutes from an existing feature
                            def to_timestamp(datetime_: datetime) -> int:
                                return timegm(datetime_.utctimetuple())
                            feature_timestamp = to_timestamp(feature.timestamp)
                            timestamp_delta_min = None
                            for existing_feature in existing_features:
                                existing_feature_timestamp = to_timestamp(existing_feature.timestamp)
                                timestamp_delta = abs(existing_feature_timestamp - feature_timestamp)
                                if timestamp_delta_min is None or timestamp_delta < timestamp_delta_min:
                                    timestamp_delta_min = timestamp_delta
                            # Usual delta between last contacts is ~10 seconds
                            if timestamp_delta_min >= 5 * 60:  # 5 minutes in seconds
                                existing_features.append(feature)
                                feature_count += 1

            self._logger.info("processed %s (%d features total)", states_csv_tar_file_path, feature_count)

        for features in features_by_icao24.values():
            features.sort(key=lambda feature: feature.timestamp)
            yield from features


