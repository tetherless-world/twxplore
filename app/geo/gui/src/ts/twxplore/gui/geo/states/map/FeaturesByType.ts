import {MapFeature} from "./MapFeature";
import {MapFeatureTypeState} from "./MapFeatureTypeState";
import {MapNumericFeatureAttributeState} from "./MapNumericFeatureAttributeState";
import {MapStringFeatureAttributeState} from "./MapStringFeatureAttributeState";

type MapFeatureAttributeState =
  | MapStringFeatureAttributeState
  | MapNumericFeatureAttributeState;
export interface FeaturesByType {
  features: MapFeature[];
  dirty: boolean;
  featureTypeState: MapFeatureTypeState;
  attributeStates: {[featureAttributeName: string]: MapFeatureAttributeState};
}
