import {MapFeature} from "./MapFeature";
import {FilterStateTypes} from "./MapFilterStateTypes";

export interface MapState {
  keplerGlInstanceRegistered: boolean;
  features: MapFeature[];
  typesVisibility: {[index: string]: boolean};
  featureTypesFilters: {
    [featureType: string]: {[attribute: string]: FilterStateTypes};
  };
  filterCounter: number;
  attributeCounter: number;
}
