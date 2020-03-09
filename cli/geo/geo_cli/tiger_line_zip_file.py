import os.path
import shutil
import tempfile
from pathlib import Path
from zipfile import ZipFile

import shapefile


class TigerLineZipFile(object):
    def __init__(self, zip_file_path: Path):
        self.__zip_file_path = zip_file_path

    def __enter__(self):
        self.__tempdir = tempfile.mkdtemp()

        with open(self.__zip_file_path, "rb") as zip_file:
            with ZipFile(zip_file) as zip_archive:
                zip_archive.extractall(self.__tempdir)

        return self

    def __exit__(self, *args, **kwds):
        shutil.rmtree(self.__tempdir)

    def shapefile_reader(self) -> shapefile.Reader:
        base_name = os.path.splitext(os.path.split(self.__zip_file_path)[1])[0]
        return shapefile.Reader(os.path.join(self.__tempdir, base_name))
