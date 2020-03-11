import json
import os

import googlemaps
from pathvalidate import sanitize_filename

from geo_cli.path import DATA_DIR_PATH


class Geocoder:
    def __init__(self):
        self.__cache_dir_path = DATA_DIR_PATH / "geocode_cache"
        self.__google_maps_api_key = os.environ["GOOGLE_MAPS_API_KEY"]

    def geocode(self, address: str) -> str:
        cache_file_name = sanitize_filename(address) + ".json"
        cache_file_path = self.__cache_dir_path / cache_file_name
        if os.path.isfile(cache_file_path):
            with open(cache_file_path) as cache_file:
                geocode_result = json.load(cache_file)
        else:
            client = googlemaps.Client(key=self.__google_maps_api_key)
            geocode_result = client.geocode(address)
            if not os.path.isdir(self.__cache_dir_path):
                os.makedirs(self.__cache_dir_path)
            with open(cache_file_path, "w+") as cache_file:
                json.dump(geocode_result, cache_file)
        latitude = geocode_result[0]["geometry"]["location"]["lat"]
        longitude = geocode_result[0]["geometry"]["location"]["lng"]
        return "POINT (%(longitude).7f, %(latitude).7f)" % locals()
