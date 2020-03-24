from geo_cli.model._uls_record import _UlsRecord


class UlsEntity(_UlsRecord):
    def __init__(self, *, city: str, name: str, state: str, street_address: str, zip_code: str, **kwds):
        _UlsRecord.__init__(self, **kwds)
        self.city = city
        self.name = name
        self.state = state
        self.street_address = street_address
        self.zip_code = zip_code

    def __repr__(self):
        return f"{self.__class__.__name__}(call_sign={self.call_sign}, name={self.name}, unique_system_identifier={self.unique_system_identifier})"
