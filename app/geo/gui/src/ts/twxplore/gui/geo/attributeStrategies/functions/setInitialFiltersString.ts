import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {useDispatch} from "react-redux";
import {setFilter} from "kepler.gl/actions";
import {MapNumericFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapNumericFeatureAttributeState";
import {FilterType} from "../../states/map/FilterType";

const dispatch = useDispatch();
export const setInitialFiltersString = (
  filterIndexOfAttribute: number,
  attributeName: string,
  stateOfAttribute: MapFeatureAttributeState,
  keplerFilterType: FilterType
): void => {
  dispatch(setFilter(filterIndexOfAttribute, "name", attributeName));
  dispatch(setFilter(filterIndexOfAttribute, "fieldType", attributeName));
  dispatch(setFilter(filterIndexOfAttribute, "type", keplerFilterType));
  //Do nothing, we don't populate the filter until the user makes a selection
  stateOfAttribute = stateOfAttribute as MapNumericFeatureAttributeState;

  return;
};
