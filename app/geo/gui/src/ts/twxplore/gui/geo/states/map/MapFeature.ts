import {MapFeatureState} from "./MapFeatureState";
import {MapFeaturesQuery_features_geometry} from "../../api/queries/types/MapFeaturesQuery";
import {FeatureType} from "../../api/graphqlGlobalTypes";

export interface MapFeature {
  __typename: "Feature";
  label?: string;
  type?: FeatureType;
  uri: string;
  frequency?: number;
  timestamp?: number;
  locality?: string;
  postalCode?: string;
  regions: string[];
  transmissionPower?: number | null;
  geometry: MapFeaturesQuery_features_geometry;
  state: MapFeatureState;
}
