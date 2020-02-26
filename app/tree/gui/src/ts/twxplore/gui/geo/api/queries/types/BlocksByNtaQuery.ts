/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BlocksByNtaQuery
// ====================================================

export interface BlocksByNtaQuery_getBlocksByNtaGeometry_geometry {
  __typename: "Geometry";
  label: string | null;
  wkt: string;
}

export interface BlocksByNtaQuery_getBlocksByNtaGeometry {
  __typename: "SelectionGeometry";
  geometry: BlocksByNtaQuery_getBlocksByNtaGeometry_geometry;
  uri: string;
}

export interface BlocksByNtaQuery {
  getBlocksByNtaGeometry: BlocksByNtaQuery_getBlocksByNtaGeometry[];
}

export interface BlocksByNtaQueryVariables {
  uri: string;
}
