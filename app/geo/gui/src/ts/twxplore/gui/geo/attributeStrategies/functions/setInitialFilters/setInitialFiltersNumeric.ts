import {MapFeatureAttributeState} from "../../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {setFilter} from "kepler.gl/actions";
import {MapNumericFeatureAttributeState} from "../../../states/map/MapFeatureAttributeState/MapNumericFeatureAttributeState";
import {FilterType} from "../../../states/map/FilterType";
import {Dispatch} from "redux";

export const setInitialFiltersNumeric = (
  filterIndexOfAttribute: number,
  attributeName: string,
  stateOfAttribute: MapFeatureAttributeState,
  keplerFilterType: FilterType,
  dispatch: Dispatch<any>
): void => {
  dispatch(setFilter(filterIndexOfAttribute, "name", attributeName));
  dispatch(setFilter(filterIndexOfAttribute, "fieldType", attributeName));
  dispatch(setFilter(filterIndexOfAttribute, "type", keplerFilterType));
  stateOfAttribute = stateOfAttribute as MapNumericFeatureAttributeState;
  dispatch(
    setFilter(filterIndexOfAttribute, "value", [
      stateOfAttribute.range.min,
      stateOfAttribute.range.max,
    ])
  );
  return;
};
