import {MapFeature} from "./MapFeature";
import {MapFilterVariables} from "./MapFilterVariables";

export interface MapState {
  keplerGlInstanceRegistered: boolean;
  features: MapFeature[];
  typesVisibility: {[index: string]: boolean};
  typesRanges: {[index: string]: MapFilterVariables};
}
