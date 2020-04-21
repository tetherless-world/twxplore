import {Action} from "redux-actions";
import {FeatureType} from "../../api/graphqlGlobalTypes";

export type ALL_FILTERS_SET = "ALL_FILTERS_SET";
export const ALL_FILTERS_SET: ALL_FILTERS_SET = "ALL_FILTERS_SET";

export interface AllFiltersSetAction
  extends Action<{featureType: FeatureType}> {
  type: ALL_FILTERS_SET;
}

export const allFiltersSet = (
  featureType: FeatureType
): AllFiltersSetAction => ({
  payload: {featureType},
  type: ALL_FILTERS_SET,
});
