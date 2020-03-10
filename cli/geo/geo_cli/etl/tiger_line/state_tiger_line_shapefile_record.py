from ._tiger_line_shapefile_record import _TigerLineShapefileRecord
from ..namespace import SCHEMA


class StateTigerLineShapefileRecord(_TigerLineShapefileRecord):
    @property
    def label(self):
        return self._record["NAME"]

    @property
    def type(self):
        return SCHEMA.State
