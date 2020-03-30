import {MapState} from "./MapState";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {filterStateTypes} from "./MapFilterStateTypes";

const typesVisibility: {[index: string]: boolean} = {};
Object.values(FeatureType).map(type => {
  typesVisibility[type] = true;
});

const featureTypesFilters: {[featureType: string]: {[attribute: string]: filterStateTypes}} = {}

//const featureTypesFilters: {[featureType: string]: MapFilterState} = {};

export const initialMapState: MapState = {
  keplerGlInstanceRegistered: false,
  features: [],
  typesVisibility: typesVisibility,
  featureTypesFilters: featureTypesFilters,
  filterCounter: 0,
  attributeIds: 0
};
