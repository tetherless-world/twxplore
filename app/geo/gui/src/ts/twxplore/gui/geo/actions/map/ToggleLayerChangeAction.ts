import {Action} from "redux-actions";
import {FeatureType} from "../../api/graphqlGlobalTypes";

export type TOGGLE_LAYER_CHANGE = "TOGGLE_LAYER_CHANGE";
export const TOGGLE_LAYER_CHANGE: TOGGLE_LAYER_CHANGE = "TOGGLE_LAYER_CHANGE";

export interface ToggleLayerChangeAction
  extends Action<{featureType: FeatureType}> {
  type: TOGGLE_LAYER_CHANGE;
}

export const toggleLayerChange = (
  featureType: FeatureType
): ToggleLayerChangeAction => ({
  payload: {featureType},
  type: TOGGLE_LAYER_CHANGE,
});
