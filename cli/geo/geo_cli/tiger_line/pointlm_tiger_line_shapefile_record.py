from ._tiger_line_shapefile_record import _TigerLineShapefileRecord
from ..namespace import DSA_GEO


class PointlmTigerLineShapefileRecord(_TigerLineShapefileRecord):
    @property
    def label(self):
        return self._record["FULLNAME"]

    @property
    def type(self):
        return DSA_GEO.Point
