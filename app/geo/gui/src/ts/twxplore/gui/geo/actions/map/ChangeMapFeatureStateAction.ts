import {Action} from "redux-actions";
import {MapFeatureState} from "../../states/map/MapFeatureState";

export type CHANGE_MAP_FEATURE_STATE = "CHANGE_MAP_FEATURE_STATE";
export const CHANGE_MAP_FEATURE_STATE: CHANGE_MAP_FEATURE_STATE =
  "CHANGE_MAP_FEATURE_STATE";

export interface ChangeMapFeatureStateAction
  extends Action<{uris: string[]; state: MapFeatureState}> {
  type: CHANGE_MAP_FEATURE_STATE;
}

export const changeMapFeatureState = (
  a_uri: string[],
  a_state: MapFeatureState
): ChangeMapFeatureStateAction => ({
  payload: {uris: a_uri, state: a_state},
  type: CHANGE_MAP_FEATURE_STATE,
});
