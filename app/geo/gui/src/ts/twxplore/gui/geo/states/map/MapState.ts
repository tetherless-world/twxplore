import {MapFeature} from "./MapFeature";
import {MapFilterState} from "./MapFilterState";

export interface MapState {
  keplerGlInstanceRegistered: boolean;
  features: MapFeature[];
  typesVisibility: {[index: string]: boolean};
  featureTypesFilters: {[featureType: string]: MapFilterState};
}
