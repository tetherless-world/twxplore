import {MapFeature} from "./MapFeature";
import {FeaturesByType} from "./FeaturesByType";
import {LoadingState} from "./LoadingState";

export interface MapState {
  keplerGlInstanceRegistered: boolean;
  features: MapFeature[];
  featuresByType: {
    [featureType: string]: FeaturesByType;
  };
  typesVisibility: {[index: string]: boolean};
  //featureTypesFilters: {
  //  [featureType: string]: {[attribute: string]: FilterStateTypes};
  // };
  filterCounter: number;
  filterableAttributesCounter: number;
  loadingState: {[featureUri: string]: LoadingState};
}
