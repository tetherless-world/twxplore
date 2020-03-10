from geo_cli.etl.tiger_line._tiger_line_shapefile_record import _TigerLineShapefileRecord
from geo_cli.namespace import TWXPLORE_GEO_APP_ONTOLOGY


class MetdivTigerLineShapefileRecord(_TigerLineShapefileRecord):
    @property
    def label(self):
        return self._record["NAME"]

    @property
    def type(self):
        return TWXPLORE_GEO_APP_ONTOLOGY.MetropolitanDivision
