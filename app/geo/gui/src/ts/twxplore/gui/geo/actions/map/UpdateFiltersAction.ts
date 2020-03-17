import {Action} from "redux-actions";
import {MapFeature} from "../../states/map/MapFeature";

export type UPDATE_FILTERS = "UPDATE_FILTERS";
export const UPDATE_FILTERS: UPDATE_FILTERS = "UPDATE_FILTERS";
export interface UpdateFiltersAction extends Action<{feature: MapFeature}> {
  type: UPDATE_FILTERS;
}

export const updateFilters = (feature: MapFeature): UpdateFiltersAction => ({
  payload: {feature: feature},
  type: UPDATE_FILTERS,
});
