import json
from datetime import datetime
from typing import Generator

from rdflib import URIRef

from geo_cli.etl.dsa._dsa_feature_transformer import _DsaFeatureTransformer
from geo_cli.model.feature import Feature
from geo_cli.model.geometry import Geometry
from geo_cli.namespace import TWXPLORE_GEO_APP_ONTOLOGY




class DsaPolicyFeatureTransformer(_DsaFeatureTransformer):
    _ROOT_LOCATION_ID = "http://www.w3.org/ns/prov#Location"

    def __calculate_effective_policy_json_object(self, *, policy_json_objects_by_id, policy_json_object):
        policy_id = policy_json_object["id"]
        effective_policy_json_object = policy_json_object.copy()
        current_json_policy_object = policy_json_object
        while True:
            for key in ("freqencyRange", "location",):
                if key in effective_policy_json_object:
                    continue
                if key not in current_json_policy_object:
                    continue
                effective_policy_json_object[key] = current_json_policy_object[key]
            extends_policy_id = current_json_policy_object.get("extendsPolicyId")
            if extends_policy_id is None:
                break
            try:
                current_json_policy_object = policy_json_objects_by_id[extends_policy_id]
                self._logger.info("found policy %s parent %s", policy_id, extends_policy_id)
            except KeyError:
                self._logger.warning("policy %s missing parent %s", policy_id, extends_policy_id)
                break
        return effective_policy_json_object

    def __collapse_location_json_object(self, *, location_json_object, location_json_objects_by_id):
        location_type = location_json_object["__type"]
        if location_type in ("feature", "missing", "root"):
            return location_json_object
        assert location_type in ("intersection", "union")
        child_location_json_objects = list(location_json_object["locations"])
        assert child_location_json_objects
        for child_location_i in range(len(child_location_json_objects)):
            child_location_json_object = child_location_json_objects[child_location_i]
            if isinstance(child_location_json_object, dict):
                continue
            assert isinstance(child_location_json_object, str)
            child_location_id = child_location_json_object
            if child_location_id == DsaPolicyFeatureTransformer._ROOT_LOCATION_ID:
                child_location_json_object = {"id": child_location_id, "__type": "root"}
            else:
                try:
                    child_location_json_object = location_json_objects_by_id[child_location_id]
                except KeyError:
                    self._logger.warning("location %s is referenced but not available", child_location_id)
                    child_location_json_object = {"id": child_location_id, "__type": "missing"}
            child_location_json_objects[child_location_i] = child_location_json_object

        if len(child_location_json_objects) == 1:
            # Collapse unions and intersections of only one location
            return \
                self.__collapse_location_json_object(
                    location_json_object=child_location_json_objects[0],
                    location_json_objects_by_id=location_json_objects_by_id
                )
        assert len(child_location_json_objects) >= 2
        location_json_object["locations"] = \
            tuple(
                self.__collapse_location_json_object(location_json_object=child_location_json_object, location_json_objects_by_id=location_json_objects_by_id)
                for child_location_json_object in child_location_json_objects
            )
        return location_json_object

    def __get_feature_location_json_object(self, location_json_object):
        location_type = location_json_object["__type"]
        if location_type == "feature":
            return location_json_object
        if location_type not in ("intersection", "union"):
            return None
        child_location_json_objects = location_json_object["locations"]
        assert len(child_location_json_objects) >= 2
        child_location_json_objects_by_type = {}
        for child_location_json_object in child_location_json_objects:
            child_location_json_objects_by_type.setdefault(child_location_json_object["__type"], []).append(child_location_json_object)
        child_feature_location_json_objects = child_location_json_objects_by_type.pop("feature", [])
        if len(child_feature_location_json_objects) != 1:
            return None
        child_feature_location_json_object = child_feature_location_json_objects[0]
        if len(child_location_json_objects_by_type) != 1:
            return None
        # Only one other location type
        other_location_type = tuple(child_location_json_objects_by_type.keys())[0]
        other_location_json_objects = child_location_json_objects_by_type[other_location_type]
        if len(other_location_json_objects) != 1:
            return None
        other_location_json_object = other_location_json_objects[0]
        if other_location_type == "root":
            return child_feature_location_json_object
        if other_location_json_object["id"] == "http://purl.org/twc/dsa/geo/USLocation":
            return child_feature_location_json_object
        return None

    def transform(self, **kwds) -> Generator[Feature, None, None]:
        locations_json_file_path = self._DSA_ONTOLOGIES_DIR_PATH / "locations.json"
        with open(locations_json_file_path) as locations_json_file:
            location_json_objects = json.load(locations_json_file)
            location_json_objects_by_id = {location_json_object["id"]: location_json_object for location_json_object in location_json_objects}

        policies_json_file_path = self._DSA_ONTOLOGIES_DIR_PATH / "policies.json"
        with open(policies_json_file_path) as policies_json_file:
            policy_json_objects = json.load(policies_json_file)
        policy_json_objects_by_id = {policy_json_object["id"]: policy_json_object for policy_json_object in policy_json_objects}

        missing_locations_count = 0
        non_feature_locations_count = 0
        unspecified_locations_count = 0
        yielded_features_count = 0
        for policy_json_object in policy_json_objects:
            policy_id = policy_json_object["id"]

            effective_policy_json_object = \
                self.__calculate_effective_policy_json_object(
                    policy_json_objects_by_id=policy_json_objects_by_id,
                    policy_json_object=policy_json_object
                )

            location_id = effective_policy_json_object.get("location")
            if not location_id:
                self._logger.info("policy %s has no location, skipping", policy_id)
                unspecified_locations_count += 1
                continue

            try:
                location_json_object = location_json_objects_by_id[location_id]
            except KeyError:
                self._logger.warning("policy %s location %s missing in locations, skipping", policy_id, location_id)
                missing_locations_count += 1
                continue

            location_json_object = self.__get_feature_location_json_object(self.__collapse_location_json_object(location_json_object=location_json_object, location_json_objects_by_id=location_json_objects_by_id))
            if location_json_object is None:
                self._logger.warn("policy %s location %s is not a feature, skipping", policy_id, location_id)
                non_feature_locations_count += 1
                continue

            geometry_json_object = location_json_object["geometry"]
            geometry = \
                Geometry(
                    uri=URIRef(geometry_json_object["id"]),
                    wkt=geometry_json_object["wkt"]
                )

            frequency_range = effective_policy_json_object.get("frequencyRange")
            if frequency_range:
                frequency_range = (frequency_range["minimum"] * 1000000.0, frequency_range["maximum"] * 1000000.0)

            label = effective_policy_json_object["label"]

            yield \
                Feature(
                    frequency_range=frequency_range,
                    geometry=geometry,
                    label=label,
                    type=TWXPLORE_GEO_APP_ONTOLOGY.Policy,
                    uri=URIRef(policy_id)
                )
            yielded_features_count += 1
        self._logger.info("yielded %d policy features, %d policies with no location specified, %d policies with missing locations, %d with non-feature locations", yielded_features_count, unspecified_locations_count, missing_locations_count, non_feature_locations_count)

