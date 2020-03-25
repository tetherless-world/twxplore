from collections import Mapping
from typing import Tuple

from geo_cli.model.uls_record_format import UlsRecordFormat


class UlsRecord(Mapping):
    def __init__(self, *, data: Tuple[str, ...], format_: UlsRecordFormat):
        self.__data = tuple(datum.strip() for datum in data)
        self.__format = format_

    def __getitem__(self, item):
        for data_element_definition in self.__format.data_element_definitions:
            if data_element_definition.name == item:
                value = self.__data[data_element_definition.position - 1]
                if value:
                    return value
                else:
                    raise KeyError(item)
        raise KeyError(item)

    def __iter__(self):
        for data_element_definition in self.__format.data_element_definitions:
            if self.__data[data_element_definition.position - 1]:
                yield data_element_definition.name

    def __len__(self):
        return len(self.__format.data_element_definitions)
    #
    # def __repr__(self):
    #     return f"{self.__class__.__name__}(call_sign={self['Call Sign']}, unique_system_identifier={self['Unique System Identifier']})"
