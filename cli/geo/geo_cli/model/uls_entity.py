class UlsEntity:
    def __init__(self, *, call_sign: str, city: str, name: str, state: str, street_address: str, unique_system_identifier: str, zip_code: str):
        self.call_sign = call_sign
        self.city = city
        self.name = name
        self.state = state
        self.street_address = street_address
        self.unique_system_identifier = unique_system_identifier
        self.zip_code = zip_code

    def __repr__(self):
        return f"{self.__class__.__name__}(call_sign={self.call_sign}, name={self.name}, unique_system_identifier={self.unique_system_identifier})"
