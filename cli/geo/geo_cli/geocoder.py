import json
import logging
import os

import googlemaps
from pathvalidate import sanitize_filename

from geo_cli.path import DATA_DIR_PATH


class Geocoder:
    def __init__(self):
        self.__cache_dir_path = DATA_DIR_PATH / "geocode_cache"
        self.__google_maps_api_key = os.environ["GOOGLE_MAPS_API_KEY"]
        self.__logger = logging.getLogger(self.__class__.__name__)

        cached_file_count = 0
        for cache_file_name in os.listdir(self.__cache_dir_path):
            if not cache_file_name.endswith(".json"):
                continue
            cache_file_base_name = os.path.splitext(cache_file_name)[0]
            if cache_file_base_name.upper() != cache_file_base_name:
                upper_cache_file_name = cache_file_base_name.upper() + ".json"
                os.rename(os.path.join(self.__cache_dir_path, cache_file_name), os.path.join(self.__cache_dir_path, upper_cache_file_name))
                self.__logger.info("renamed %s to %s", cache_file_name, upper_cache_file_name)
            cached_file_count += 1
        self.__logger.info("cached geocodes: %d", cached_file_count)

    def geocode(self, address: str) -> str:
        address = address.upper()
        cache_file_name = sanitize_filename(address) + ".json"
        cache_file_path = self.__cache_dir_path / cache_file_name
        if os.path.isfile(cache_file_path):
            with open(cache_file_path) as cache_file:
                geocode_result = json.load(cache_file)
        else:
            client = googlemaps.Client(key=self.__google_maps_api_key)
            geocode_result = client.geocode(address)
            if geocode_result:
                self.__logger.info("geocoded %s", address)
            else:
                # Empty list
                self.__logger.info("geocode of %s failed", address)
            if not os.path.isdir(self.__cache_dir_path):
                os.makedirs(self.__cache_dir_path)
            # Write successful and failed results to a file, so we cache both.
            with open(cache_file_path, "w+") as cache_file:
                json.dump(geocode_result, cache_file)
        if not geocode_result:
            raise LookupError
        latitude = geocode_result[0]["geometry"]["location"]["lat"]
        longitude = geocode_result[0]["geometry"]["location"]["lng"]
        return "POINT (%(longitude).7f %(latitude).7f)" % locals()
