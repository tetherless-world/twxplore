import {MapState} from "./MapState";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {MapFilterState} from "./MapFilterState";

const typesVisibility: {[index: string]: boolean} = {};
Object.values(FeatureType).map(type => {
  typesVisibility[type] = true;
});

const featureTypesFilters: {[featureType: string]: MapFilterState} = {};

export const initialMapState: MapState = {
  keplerGlInstanceRegistered: false,
  features: [],
  typesVisibility: typesVisibility,
  featureTypesFilters: featureTypesFilters,
};
