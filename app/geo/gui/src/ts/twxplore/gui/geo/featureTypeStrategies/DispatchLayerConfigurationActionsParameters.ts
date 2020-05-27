import {MapFeatureTypeState} from "../states/map/MapFeatureTypeState";
import {Dispatch} from "redux";

export interface DispatchLayerConfigurationActionsParameters {
  keplerLayerOfFeatureType: any;
  keplerFilterOfFeatureType: any;
  keplerFieldsOfFeatureType: any;
  keplerInteractionConfigCopy: any;
  featureTypeStateOfFeatureType: MapFeatureTypeState;
  dispatch: Dispatch<any>;
}
