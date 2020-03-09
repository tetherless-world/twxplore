import os.path

import pygeoif
import shapefile

DATA_DIR_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "geo"))


def main():
    for file_base_name in ("tl_2018_us_mil",):
        with shapefile.Reader(os.path.join(DATA_DIR_PATH, file_base_name, file_base_name)) as shapefile_reader:
            for shape in shapefile_reader:
                geometry = pygeoif.geometry.as_shape(shape)
                print(geometry.geometry.wkt)

