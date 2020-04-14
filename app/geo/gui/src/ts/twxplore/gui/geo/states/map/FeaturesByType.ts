import {MapFeature} from "./MapFeature";
import {MapFeatureTypeState} from "./MapFeatureTypeState";

export interface FeaturesByType {
  features: MapFeature[];
  dirty: boolean;
  featureTypeState: MapFeatureTypeState;
}
