import {MapFeature} from "./MapFeature";

export interface MapState {
  keplerGlInstanceRegistered: boolean;
  features: MapFeature[];
  typesVisibility: {[index: string]: boolean};
}
