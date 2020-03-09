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
from .namespace import DSA_GEO, SCHEMA


class TigerLineZipFile(object):
    def __init__(self, type: str, zip_file_path: Path):
        self.__type = type.lower()
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
            field_names = tuple(field[0] for field in shapefile_reader.fields)
            for shape_i, shape in enumerate(shapefile_reader):
                for field_name in field_names:
                    if field_name == "DeletionFlag":
                        continue
                    print(field_name, shape.record[field_name])
                print()
                label = None
                for label_key in ("FULLNAME", "NAME"):
                    try:
                        label = shape.record[label_key]
                        break
                    except IndexError:
                        pass
                if label is None:
                    raise RuntimeError
                type = None
                if self.__type == "state":
                    type = SCHEMA.State
                wkt = pygeoif.geometry.as_shape(shape).geometry.wkt
                geometry = Geometry(label=label, uri=DSA_GEO[base_name + "/geometry/" + str(shape_i)], wkt=wkt)
                feature = Feature(label=label, geometry=geometry, type=type, uri=DSA_GEO[base_name + "/feature/" + str(shape_i)])
                yield feature

    def __shapefile_reader(self):
        return shapefile.Reader(os.path.join(self.__tempdir, self.__base_name))
