import { MapFeatureType } from "./MapFeatureType";
import { MapFeatureState } from "./MapFeatureState";


export interface MapFeature {
  childType?: MapFeatureType;
  geometry?: {
    wkt: string;
  };
  label: string | null;
  parentUri?: string;
  uri: string;
  state: MapFeatureState
}
