import json
import os.path
from pathlib import Path

from geo_cli.etl._loader import _Loader
from geo_cli.namespace import TWXPLORE_GEO_APP_ONTOLOGY


class RequestJsonLoader(_Loader):
    __TRANSMISSION_FEATURE_TYPE = TWXPLORE_GEO_APP_ONTOLOGY.Transmission

    def __init__(self, json_file_path: Path):
        self.__json_file_path = json_file_path

    def __enter__(self):
        self.__json_objects = []
        return self

    def __exit__(self, *args, **kwds):
        json_dir_path = os.path.split(self.__json_file_path)[0]
        if not os.path.isdir(json_dir_path):
            os.makedirs(json_dir_path)
        with open(self.__json_file_path, "w+") as json_file:
            json.dump(self.__json_objects, json_file)

    def load(self, features):
        for feature in features:
            if feature.frequency is None:
                continue
            if feature.timestamp is None:
                continue
            if feature.type != self.__TRANSMISSION_FEATURE_TYPE:
                continue

            if feature.geometry.wkt.startswith("POINT (") and feature.geometry.wkt.endswith(")"):
                point = feature.geometry.wkt[len("POINT ("):-len(")")].split()
                assert len(point) == 2
                location = {
                    "x": float(point[0]),
                    "y": float(point[1])
                }
            else:
                raise NotImplementedError(feature.geometry.wkt)

            self.__json_objects.append({
                "dateRange": {
                    "from": feature.timestamp.isoformat(),
                    "until": feature.timestamp.isoformat(),
                },
                "location": location,
                "frequencyRange": {
                    "maximum": feature.frequency,
                    "minimum": feature.frequency
                },
                "id": str(feature.uri)
            })
