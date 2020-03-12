/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { FeatureQuery, FeatureType } from "./../../graphqlGlobalTypes";

// ====================================================
// GraphQL query operation: FeaturesQuery
// ====================================================

export interface FeaturesQuery_features_geometry {
  __typename: "Geometry";
  label: string | null;
  wkt: string;
  uri: string;
}

export interface FeaturesQuery_features {
  __typename: "Feature";
  label: string | null;
  type: FeatureType | null;
  uri: string;
  geometry: FeaturesQuery_features_geometry;
}

export interface FeaturesQuery {
  features: FeaturesQuery_features[];
}

export interface FeaturesQueryVariables {
  query: FeatureQuery;
  limit?: number | null;
  offset?: number | null;
}
