import {MapStringFeatureAttributeState} from "./MapStringFeatureAttributeState";
import {MapNumericFeatureAttributeState} from "./MapNumericFeatureAttributeState";

export type MapFeatureAttributeState =
  | MapStringFeatureAttributeState
  | MapNumericFeatureAttributeState;
