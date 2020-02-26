/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BlocksQuery
// ====================================================

export interface BlocksQuery_getBlockGeometries_geometry {
  __typename: "Geometry";
  label: string | null;
  wkt: string;
}

export interface BlocksQuery_getBlockGeometries {
  __typename: "SelectionGeometry";
  geometry: BlocksQuery_getBlockGeometries_geometry;
  uri: string;
}

export interface BlocksQuery {
  getBlockGeometries: BlocksQuery_getBlockGeometries[];
}
