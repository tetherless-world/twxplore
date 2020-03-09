import os.path

import pygeoif

from .tiger_line_zip_file import TigerLineZipFile

DATA_DIR_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "geo"))




def main():
    for file_base_name in ("tl_2018_us_mil",):
        with TigerLineZipFile(os.path.join(DATA_DIR_PATH, file_base_name + ".zip")) as tiger_line_zip_file:
            with tiger_line_zip_file.shapefile_reader() as shapefile_reader:
                for shape in shapefile_reader:
                    geometry = pygeoif.geometry.as_shape(shape)
                    print(geometry.geometry.wkt)

