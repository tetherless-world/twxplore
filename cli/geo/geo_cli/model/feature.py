import logging
from datetime import datetime
from typing import Optional, Tuple

from rdflib import URIRef

from geo_cli.etl.tiger_line.states import STATE_NAMES
from geo_cli.model.frequency_range import FrequencyRange
from geo_cli.model.geometry import Geometry


class Feature:
    def __init__(
            self, *,
            geometry: Geometry,
            label: str,
            uri: URIRef,
            locality: Optional[str] = None,
            frequency: Optional[float] = None,
            frequency_range: Optional[FrequencyRange] = None,
            postal_code: Optional[str] = None,
            regions: Optional[Tuple[str, ...]] = None,
            timestamp: Optional[datetime] = None,
            transmission_power: Optional[int] = None,
            type: Optional[URIRef] = None
    ):
        self.__locality = locality
        self.__frequency = frequency
        self.__frequency_range = frequency_range
        self.__geometry = geometry
        self.__label = label
        self.__postal_code = postal_code
        if regions is not None:
            for region in regions:
                if region not in STATE_NAMES:
                    logging.warning("region not a state name: %s", region)
        self.__regions = regions
        if timestamp is not None:
            assert timestamp.tzinfo is not None
        self.__timestamp = timestamp
        self.__transmission_power = transmission_power
        self.__type = type
        self.__uri = uri

    @property
    def locality(self) -> Optional[str]:
        return self.__locality

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
    def postal_code(self) -> Optional[str]:
        return self.__postal_code

    @property
    def timestamp(self) -> Optional[datetime]:
        return self.__timestamp

    @property
    def transmission_power(self) -> Optional[int]:
        return self.__transmission_power

    @property
    def regions(self) -> Optional[Tuple[str, ...]]:
        return self.__regions

    @property
    def type(self) -> Optional[URIRef]:
        return self.__type

    @property
    def uri(self) -> URIRef:
        return self.__uri
