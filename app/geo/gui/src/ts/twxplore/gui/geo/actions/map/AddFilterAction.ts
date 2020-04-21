import {FeatureType} from "../../api/graphqlGlobalTypes";

export type ADD_FILTER = "@@kepler.gl/ADD_FILTER";
export const ADD_FILTER: ADD_FILTER = "@@kepler.gl/ADD_FILTER";

export interface AddFilterAction {
  type: ADD_FILTER;
  dataId: FeatureType;
}

export const addFilter = (dataId: FeatureType): AddFilterAction => ({
  type: ADD_FILTER,
  dataId: dataId,
});
