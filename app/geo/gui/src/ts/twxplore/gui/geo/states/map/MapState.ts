import {MapFeature} from "./MapFeature";
import {filterStateTypes} from "./MapFilterStateTypes";

export interface MapState {
  keplerGlInstanceRegistered: boolean;
  features: MapFeature[];
  typesVisibility: {[index: string]: boolean};
  featureTypesFilters: {
    [featureType: string]: {[attribute: string]: filterStateTypes};
  };
  filterCounter: number;
  attributeIds: number;
}
