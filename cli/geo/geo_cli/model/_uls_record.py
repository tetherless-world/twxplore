class _UlsRecord:
    def __init__(self, *, call_sign: str, unique_system_identifier: str):
        self.call_sign = call_sign
        self.unique_system_identifier = unique_system_identifier

    def __repr__(self):
        return f"{self.__class__.__name__}(call_sign={self.call_sign}, unique_system_identifier={self.unique_system_identifier})"
