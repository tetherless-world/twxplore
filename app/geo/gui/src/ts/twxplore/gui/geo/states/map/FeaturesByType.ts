import {MapFeature} from "./MapFeature";
import {MapFeatureTypeState} from "./MapFeatureTypeState";
import {MapFeatureAttributeState} from "./MapFeatureAttributeState/MapFeatureAttributeState";
import {KeplerLayerType} from "./KeplerLayerType";

export interface FeaturesByType {
  features: MapFeature[];
  dirty: boolean;
  featureTypeState: MapFeatureTypeState;
  attributeStates: {[featureAttributeName: string]: MapFeatureAttributeState};
  visible: boolean;
  currentKeplerLayerType: KeplerLayerType;
}
