import {MapFeature} from "./MapFeature";

export interface FeaturesByType {
  features: MapFeature[];
  dirty: boolean;
  needsFilters: boolean;
  filtersAdded: boolean;
}
