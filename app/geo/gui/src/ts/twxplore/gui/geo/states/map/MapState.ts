import {MapFeature} from "./MapFeature";
import {FilterStateTypes} from "./MapFilterStateTypes";
import {FeaturesByType} from "./FeaturesByType";
import {LoadingState} from "./LoadingState";

export interface MapState {
  keplerGlInstanceRegistered: boolean;
  features: MapFeature[];
  featuresByType: {
    [featureType: string]: FeaturesByType;
  };
  typesVisibility: {[index: string]: boolean};
  featureTypesFilters: {
    [featureType: string]: {[attribute: string]: FilterStateTypes};
  };
  filterCounter: number;
  attributeCounter: number;
  loadingState: {[featureUri: string]: LoadingState};
}
