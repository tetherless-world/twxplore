import {MapFeatureAttributeState} from "../../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {setFilter} from "kepler.gl/actions";
import {KeplerFilterType} from "../../../states/map/KeplerFilterType";
import {Dispatch} from "redux";
import {MapStringFeatureAttributeState} from "../../../states/map/MapFeatureAttributeState/MapStringFeatureAttributeState";

export const setInitialFiltersString = (
  filterIndexOfAttribute: number,
  attributeName: string,
  stateOfAttribute: MapFeatureAttributeState,
  keplerFilterType: KeplerFilterType,
  dispatch: Dispatch<any>
): void => {
  stateOfAttribute = stateOfAttribute as MapStringFeatureAttributeState;
  dispatch(setFilter(filterIndexOfAttribute, "name", attributeName));
  dispatch(setFilter(filterIndexOfAttribute, "type", keplerFilterType));
  dispatch(setFilter(filterIndexOfAttribute, "enlarged", false)); //disables any pop-up Kepler may bring up with the filter

  return;
};
