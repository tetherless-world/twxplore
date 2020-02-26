/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BoroughsQuery
// ====================================================

export interface BoroughsQuery_getBoroughGeometries_geometry {
  __typename: "Geometry";
  label: string | null;
  wkt: string;
}

export interface BoroughsQuery_getBoroughGeometries {
  __typename: "SelectionGeometry";
  geometry: BoroughsQuery_getBoroughGeometries_geometry;
  uri: string;
}

export interface BoroughsQuery {
  getBoroughGeometries: BoroughsQuery_getBoroughGeometries[];
}
