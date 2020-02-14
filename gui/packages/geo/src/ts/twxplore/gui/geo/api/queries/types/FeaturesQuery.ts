/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FeaturesQuery
// ====================================================

export interface FeaturesQuery_features {
  __typename: "Feature";
  label: string | null;
  uri: string;
}

export interface FeaturesQuery {
  features: FeaturesQuery_features[];
}

export interface FeaturesQueryVariables {
  limit: number;
  offset: number;
}
