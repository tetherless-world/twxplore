import { MapFeatureState } from "./MapFeatureState";


export interface MapFeature {
  geometry?: {
    wkt: string;
  };
  label: string | null;
  parentUri?: string;
  uri: string;
  state: MapFeatureState
}
