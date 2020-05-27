import {MapFeatureState} from "./MapFeatureState";
import {MapFeaturesQuery_features} from "../../api/queries/types/MapFeaturesQuery";

export interface MapFeature extends MapFeaturesQuery_features {
  state: MapFeatureState;
  y?: number;
  x?: number;
  frequencyString?: string;
  timestampString?: string;
  transmissionPowerString?: string;
}
