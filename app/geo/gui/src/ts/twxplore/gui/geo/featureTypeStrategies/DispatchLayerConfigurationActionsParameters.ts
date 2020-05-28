import {MapFeatureTypeState} from "../states/map/MapFeatureTypeState";
import {Dispatch} from "redux";
import {KeplerLayerType} from "../states/map/KeplerLayerType";

export interface DispatchLayerConfigurationActionsParameters {
  keplerLayerOfFeatureType: any;
  keplerFilterOfFeatureType: any;
  keplerFieldsOfFeatureType: any;
  keplerInteractionConfigCopy: any;
  featureTypeStateOfFeatureType: MapFeatureTypeState;
  keplerLayerTypeOfFeatureType: KeplerLayerType;
  dispatch: Dispatch<any>;
}
