/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NtasByBoroughQuery
// ====================================================

export interface NtasByBoroughQuery_getNtasByBoroughGeometry_geometry {
  __typename: "Geometry";
  label: string | null;
  wkt: string;
}

export interface NtasByBoroughQuery_getNtasByBoroughGeometry {
  __typename: "SelectionGeometry";
  geometry: NtasByBoroughQuery_getNtasByBoroughGeometry_geometry;
  uri: string;
}

export interface NtasByBoroughQuery {
  getNtasByBoroughGeometry: NtasByBoroughQuery_getNtasByBoroughGeometry[];
}

export interface NtasByBoroughQueryVariables {
  uri: string;
}
