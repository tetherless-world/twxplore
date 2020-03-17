from datetime import datetime
from typing import Optional

from rdflib import URIRef

from geo_cli.model.frequency_range import FrequencyRange
from geo_cli.model.geometry import Geometry


class Feature:
    def __init__(
            self, *,
            geometry: Geometry,
            label: str,
            uri: URIRef,
            frequency: Optional[float] = None,
            frequency_range: Optional[FrequencyRange] = None,
            timestamp: Optional[datetime],
            transmission_power: Optional[int] = None,
            type: Optional[URIRef] = None
    ):
        if timestamp is not None:
            assert timestamp.tzinfo is not None
        self.__frequency = frequency
        self.__frequency_range = frequency_range
        self.__geometry = geometry
        self.__label = label
        self.__timestamp = timestamp
        self.__transmission_power = transmission_power
        self.__type = type
        self.__uri = uri

    @property
    def frequency(self) -> Optional[float]:
        return self.__frequency

    @property
    def frequency_range(self) -> Optional[FrequencyRange]:
        return self.__frequency_range

    @property
    def geometry(self) -> Geometry:
        return self.__geometry

    @property
    def label(self) -> str:
        return self.__label

    @property
    def timestamp(self) -> Optional[datetime]:
        return self.__timestamp

    @property
    def transmission_power(self) -> Optional[int]:
        return self.__transmission_power

    @property
    def type(self) -> Optional[URIRef]:
        return self.__type

    @property
    def uri(self) -> URIRef:
        return self.__uri
