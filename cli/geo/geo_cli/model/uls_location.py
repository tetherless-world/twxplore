from geo_cli.model._uls_record import _UlsRecord


class UlsLocation(_UlsRecord):
    def __init__(self, *, city: str, state: str, street_address: str, **kwds):
        _UlsRecord.__init__(self, **kwds)
        self.city = city
        self.state = state
        self.street_address = street_address
