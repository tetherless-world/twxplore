/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import {FeatureQuery, FeatureType} from "./../../graphqlGlobalTypes";

// ====================================================
// GraphQL query operation: MapFeaturesQuery
// ====================================================

export interface MapFeaturesQuery_features_geometry {
  __typename: "Geometry";
  label: string | null;
  wkt: string;
  uri: string;
}

export interface MapFeaturesQuery_features {
  __typename: "Feature";
  label: string | null;
  type: FeatureType | null;
  uri: string;
  frequency: number | null;
  timestamp: number | null;
  locality: string | null;
  postalCode: string | null;
  regions: string[];
  transmissionPower: number | null;
  geometry: MapFeaturesQuery_features_geometry;
}

export interface MapFeaturesQuery {
  features: MapFeaturesQuery_features[];
}

export interface MapFeaturesQueryVariables {
  query: FeatureQuery;
  limit?: number | null;
  offset?: number | null;
}
