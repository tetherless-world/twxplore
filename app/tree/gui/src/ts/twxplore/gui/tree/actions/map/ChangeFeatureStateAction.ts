import {Action} from "redux-actions";
import { MapFeatureState } from "../../states/map/MapFeatureState";

export type CHANGE_FEATURE_STATE = 'CHANGE_FEATURE_STATE';
export const CHANGE_FEATURE_STATE: CHANGE_FEATURE_STATE = 'CHANGE_FEATURE_STATE';

export interface ChangeFeatureStateAction extends Action<{uri: string, state: MapFeatureState}>{
    type: CHANGE_FEATURE_STATE
}

export const changeFeatureState = (a_uri: string, a_state: MapFeatureState): ChangeFeatureStateAction => ({ payload: { uri: a_uri, state: a_state }, type: CHANGE_FEATURE_STATE })
