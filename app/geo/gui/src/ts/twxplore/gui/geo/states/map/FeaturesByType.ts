import {MapFeature} from "./MapFeature";
import {MapFeatureTypeState} from "./MapFeatureTypeState";
import {MapFeatureAttributeState} from "./MapFeatureAttributeState/MapFeatureAttributeState";

export interface FeaturesByType {
  features: MapFeature[];
  dirty: boolean;
  featureTypeState: MapFeatureTypeState;
  attributeStates: {[featureAttributeName: string]: MapFeatureAttributeState};
}
