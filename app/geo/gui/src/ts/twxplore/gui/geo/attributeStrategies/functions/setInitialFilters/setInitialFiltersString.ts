import {MapFeatureAttributeState} from "../../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {setFilter} from "kepler.gl/actions";
import {MapNumericFeatureAttributeState} from "../../../states/map/MapFeatureAttributeState/MapNumericFeatureAttributeState";
import {KeplerFilterType} from "../../../states/map/KeplerFilterType";
import {Dispatch} from "redux";

export const setInitialFiltersString = (
  filterIndexOfAttribute: number,
  attributeName: string,
  stateOfAttribute: MapFeatureAttributeState,
  keplerFilterType: KeplerFilterType,
  dispatch: Dispatch<any>
): void => {
  dispatch(setFilter(filterIndexOfAttribute, "name", attributeName));
  dispatch(setFilter(filterIndexOfAttribute, "KeplerFieldType", attributeName));
  dispatch(setFilter(filterIndexOfAttribute, "type", keplerFilterType));
  //Do nothing, we don't populate the filter until the user makes a selection
  stateOfAttribute = stateOfAttribute as MapNumericFeatureAttributeState;

  return;
};
