import os.path
import shutil
import tempfile
from pathlib import Path
from typing import Generator
from zipfile import ZipFile

import pygeoif
import shapefile

from .feature import Feature
from .geometry import Geometry
from .namespace import DSA_GEO


class TigerLineZipFile(object):
    def __init__(self, zip_file_path: Path):
        self.__zip_file_path = zip_file_path

    @property
    def __base_name(self):
        return os.path.splitext(os.path.split(self.__zip_file_path)[1])[0]

    def __enter__(self):
        self.__tempdir = tempfile.mkdtemp()

        with open(self.__zip_file_path, "rb") as zip_file:
            with ZipFile(zip_file) as zip_archive:
                zip_archive.extractall(self.__tempdir)

        return self

    def __exit__(self, *args, **kwds):
        shutil.rmtree(self.__tempdir)

    def extract_features(self) -> Generator[Feature, None, None]:
        base_name = self.__base_name
        areaids = set()
        with self.__shapefile_reader() as shapefile_reader:
            print("Shapefile fields:", shapefile_reader.fields)
            for shape in shapefile_reader:
                areaid = shape.record["AREAID"]
                assert not areaid in areaids, areaid
                areaids.add(areaid)
# ALAND = {int} 1443458
# ANSICODE = {str} ''
# AREAID = {str} '110509768024'
# AWATER = {int} 0
# FULLNAME = {str} 'Tripler Army Medical Ctr'
# INTPTLAT = {str} '+21.3620086'
# INTPTLON = {str} '-157.8896492'
# MTFCC = {str} 'K2110'
# oid = {int} -1
# 0 = {str} ''
# 1 = {str} '110509768024'
# 2 = {str} 'Tripler Army Medical Ctr'
# 3 = {str} 'K2110'
# 4 = {int} 1443458
# 5 = {int} 0
# 6 = {str} '+21.3620086'
# 7 = {str} '-157.8896492'
# __len__ = {int} 8
                fullname = shape.record["FULLNAME"]
                wkt = pygeoif.geometry.as_shape(shape).geometry.wkt
                geometry = Geometry(label=fullname, uri=DSA_GEO[base_name + "/geometry/" + areaid], wkt=wkt)
                feature = Feature(label=fullname, geometry=geometry, uri=DSA_GEO[base_name + "/feature/" + areaid])
                yield feature

    def __shapefile_reader(self):
        return shapefile.Reader(os.path.join(self.__tempdir, self.__base_name))
