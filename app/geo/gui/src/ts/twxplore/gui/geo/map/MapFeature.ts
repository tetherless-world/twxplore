import { MapFeatureType } from "./MapFeatureType";


export interface MapFeature {
  childType?: MapFeatureType;
  geometry?: {
    wkt: string;
  };
  label: string | null;
  parentUri?: string;
  uri: string;
}
