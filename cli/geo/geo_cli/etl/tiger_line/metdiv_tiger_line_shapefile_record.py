from geo_cli.etl.tiger_line._tiger_line_shapefile_record import _TigerLineShapefileRecord
from geo_cli.etl.tiger_line.states import STATE_NAMES_BY_ABBREVIATION
from geo_cli.namespace import TWXPLORE_GEO_APP_ONTOLOGY


class MetdivTigerLineShapefileRecord(_TigerLineShapefileRecord):
    @property
    def label(self):
        return self._record["NAME"]

    @property
    def locality(self):
        return None

    @property
    def region(self):
        # The GEOID appears to unreliable e.g., 1446015764 with a NAME in Massachusetts,
        # but 14 is the FIPS code for Guam
        # Parse the name instead
        # geoid = str(self._record["GEOID"])
        # state_fips_code = int(geoid[:2])
        # state_name = STATE_NAMES_BY_FIPS_CODE.get(state_fips_code)
        # print(state_fips_code, state_name)
        # return state_name
        state_abbreviation = self.label.rsplit(sep=None, maxsplit=1)[-1]
        # Some metropolitan divisions cross state lines e.g., New York-Jersey City-White Plains, NY-NJ
        # Just ignore those.
        state_name = STATE_NAMES_BY_ABBREVIATION.get(state_abbreviation)
        return state_name

    @property
    def type(self):
        return TWXPLORE_GEO_APP_ONTOLOGY.MetropolitanDivision
