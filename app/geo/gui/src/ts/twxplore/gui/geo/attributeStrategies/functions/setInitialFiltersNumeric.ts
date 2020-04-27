import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {setFilter} from "kepler.gl/actions";
import {MapNumericFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapNumericFeatureAttributeState";
import {FilterType} from "../../states/map/FilterType";
import {store} from "../../store";

export const setInitialFiltersNumeric = (
  filterIndexOfAttribute: number,
  attributeName: string,
  stateOfAttribute: MapFeatureAttributeState,
  keplerFilterType: FilterType
): void => {
  store.dispatch(setFilter(filterIndexOfAttribute, "name", attributeName));
  store.dispatch(setFilter(filterIndexOfAttribute, "fieldType", attributeName));
  store.dispatch(setFilter(filterIndexOfAttribute, "type", keplerFilterType));
  stateOfAttribute = stateOfAttribute as MapNumericFeatureAttributeState;
  store.dispatch(
    setFilter(filterIndexOfAttribute, "value", [
      stateOfAttribute.min,
      stateOfAttribute.max,
    ])
  );
  return;
};
