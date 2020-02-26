/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NtasQuery
// ====================================================

export interface NtasQuery_getNtaGeometries_geometry {
  __typename: "Geometry";
  label: string | null;
  wkt: string;
}

export interface NtasQuery_getNtaGeometries {
  __typename: "SelectionGeometry";
  geometry: NtasQuery_getNtaGeometries_geometry;
  uri: string;
}

export interface NtasQuery {
  getNtaGeometries: NtasQuery_getNtaGeometries[];
}
