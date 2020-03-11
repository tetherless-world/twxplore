from typing import Generator

import pygeoif

from geo_cli.etl._transformer import _Transformer
from geo_cli.etl.tiger_line.metdiv_tiger_line_shapefile_record import MetdivTigerLineShapefileRecord
from geo_cli.etl.tiger_line.mil_tiger_line_shapefile_record import MilTigerLineShapefileRecord
from geo_cli.etl.tiger_line.state_tiger_line_shapefile_record import StateTigerLineShapefileRecord
from geo_cli.etl.tiger_line.tiger_line_zip_file import TigerLineZipFile
from geo_cli.model.feature import Feature
from geo_cli.model.geometry import Geometry
from geo_cli.namespace import TWXPLORE_GEO_APP_GEOMETRY, TWXPLORE_GEO_APP_FEATURE
from geo_cli.path import DATA_DIR_PATH


class TigerLineTransformer(_Transformer):
    def transform(self, **kwds) -> Generator[Feature, None, None]:
        tiger_line_files = (
            ("tl_2019_us_metdiv", MetdivTigerLineShapefileRecord),
            # ("tl_2019_01_pointlm", PointlmTigerLineShapefileRecord),
            ("tl_2019_us_mil", MilTigerLineShapefileRecord),
            ("tl_2019_us_state", StateTigerLineShapefileRecord),
        )
        for file_base_name, shapefile_record_type in tiger_line_files:
            with TigerLineZipFile(DATA_DIR_PATH / "extracted" / "tiger_line" / (file_base_name + ".zip")) as tiger_line_zip_file:
                areaids = set()
                with tiger_line_zip_file.shapefile_reader() as shapefile_reader:
                    # print("Shapefile fields:", shapefile_reader.fields)
                    field_names = tuple(field[0] for field in shapefile_reader.fields)
                    for shape_i, shape in enumerate(shapefile_reader):
                        for field_name in field_names:
                            if field_name == "DeletionFlag":
                                continue
                            # print(field_name, shape.record[field_name])
                        # print()
                        record = shapefile_record_type(shape.record)
                        label = record.label
                        label = label.strip()
                        if not label:
                            continue
                        geometry = \
                            Geometry(
                                uri=TWXPLORE_GEO_APP_GEOMETRY[f"tiger_line-{file_base_name}-{str(shape_i)}"],
                                wkt=pygeoif.geometry.as_shape(shape).geometry.wkt
                            )
                        feature = \
                            Feature(
                                label=label,
                                geometry=geometry,
                                type=record.type,
                                uri=TWXPLORE_GEO_APP_FEATURE[f"tiger_line-{file_base_name}-{str(shape_i)}"]
                            )
                        yield feature
