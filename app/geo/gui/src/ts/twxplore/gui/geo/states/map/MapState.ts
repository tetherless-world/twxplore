import {MapFeature} from "./MapFeature";
import {FeatureType} from "../../api/graphqlGlobalTypes";

export interface MapState {
  keplerGlInstanceRegistered: boolean;
  features: MapFeature[];
  desiredSelectionTypes: FeatureType[];
}
