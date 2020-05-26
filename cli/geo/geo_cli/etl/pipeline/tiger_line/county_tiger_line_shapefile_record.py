from geo_cli.etl.pipeline.tiger_line._tiger_line_shapefile_record import _TigerLineShapefileRecord
from geo_cli.etl.pipeline.tiger_line.states import STATE_NAMES_BY_FIPS_CODE
from geo_cli.namespace import TWXPLORE_GEO_APP_ONTOLOGY


class CountyTigerLineShapefileRecord(_TigerLineShapefileRecord):
    @property
    def label(self):
        return self._record["NAME"]

    @property
    def locality(self):
        return None

    @property
    def regions(self):
        state_fips_code = int(self._record["STATEFP"])
        state_name = STATE_NAMES_BY_FIPS_CODE[state_fips_code]
        return (state_name,)

    @property
    def type(self):
        return TWXPLORE_GEO_APP_ONTOLOGY.County
