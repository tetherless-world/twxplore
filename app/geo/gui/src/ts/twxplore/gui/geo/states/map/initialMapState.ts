import {MapState} from "./MapState";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {FilterStateTypes} from "./MapFilterStateTypes";
import {FeaturesByType} from "./FeaturesByType";

const typesVisibility: {[index: string]: boolean} = {};
Object.values(FeatureType).map(type => {
  typesVisibility[type] = true;
});

const featureTypesFilters: {
  [featureType: string]: {[attribute: string]: FilterStateTypes};
} = {};

const featuresByType: {
  [featureType: string]: FeaturesByType;
} = {};
Object.values(FeatureType).map(type => {
  featuresByType[type] = {
    features: [],
    dirty: false,
    needsFilters: false,
    filtersAdded: false,
  };
});

//const featureTypesFilters: {[featureType: string]: MapFilterState} = {};

export const initialMapState: MapState = {
  keplerGlInstanceRegistered: false,
  features: [],
  featuresByType: featuresByType,
  typesVisibility: typesVisibility,
  featureTypesFilters: featureTypesFilters,
  filterCounter: 0,
  attributeCounter: 0,
  loadingState: {},
  //prevResultCount: 0,
  //totalResultCount: 0,
};
