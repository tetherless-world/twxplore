import {MapFeature} from "../../states/map/MapFeature";
import { FeatureType } from "../../api/graphqlGlobalTypes";

export type ADD_FILTER = "@@kepler.gl/ADD_FILTER";
export const ADD_FILTER: ADD_FILTER = "@@kepler.gl/ADD_FILTER";

export interface AddFilterAction{
  type: ADD_FILTER;
  dataId: FeatureType,
  feature: MapFeature,
  idx: number,

}

export const addFilter = (
  dataId: FeatureType, feature:MapFeature,idx:number
): AddFilterAction => ({type: ADD_FILTER, dataId: dataId, feature: feature, idx: idx});
