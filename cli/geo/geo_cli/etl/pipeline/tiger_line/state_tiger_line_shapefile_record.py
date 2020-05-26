from geo_cli.etl.pipeline.tiger_line._tiger_line_shapefile_record import _TigerLineShapefileRecord
from geo_cli.namespace import TWXPLORE_GEO_APP_ONTOLOGY


class StateTigerLineShapefileRecord(_TigerLineShapefileRecord):
    @property
    def label(self):
        return self._record["NAME"]

    @property
    def locality(self):
        return None

    @property
    def regions(self):
        return (self._record["NAME"],)

    @property
    def type(self):
        return TWXPLORE_GEO_APP_ONTOLOGY.State
