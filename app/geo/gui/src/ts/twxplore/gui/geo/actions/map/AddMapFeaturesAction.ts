import {Action} from "redux-actions";
import {MapFeature} from "../../states/map/MapFeature";

export type ADD_MAP_FEATURES = "ADD_MAP_FEATURES";
export const ADD_MAP_FEATURES: ADD_MAP_FEATURES = "ADD_MAP_FEATURES";

export interface AddMapFeaturesAction extends Action<{features: MapFeature[]}> {
  type: ADD_MAP_FEATURES;
}

export const addMapFeatures = (
  features: MapFeature[]
): AddMapFeaturesAction => ({payload: {features}, type: ADD_MAP_FEATURES});
