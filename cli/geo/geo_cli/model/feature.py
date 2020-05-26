from datetime import datetime
from typing import Optional, Tuple, NamedTuple

from rdflib import URIRef

from geo_cli.model.geometry import Geometry


class Feature(NamedTuple):
    geometry: Geometry
    label: str
    uri: URIRef
    locality: Optional[str] = None
    frequency: Optional[float] = None
    frequency_range: Optional[Tuple[float, float]] = None
    postal_code: Optional[str] = None
    regions: Optional[Tuple[str, ...]] = None
    timestamp: Optional[datetime] = None
    timestamp_range: Optional[Tuple[datetime, datetime]] = None
    transmission_power: Optional[int] = None
    type: Optional[URIRef] = None

    # if regions is not None:
    #     for region in regions:
    #         if region not in STATE_NAMES:
    #             logging.warning("region not a state name: %s", region)
    # if timestamp is not None:
    #     assert timestamp.tzinfo is not None
