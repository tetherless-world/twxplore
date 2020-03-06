/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NtasByBoroughQuery
// ====================================================

export interface NtasByBoroughQuery_ntas_byBoroughGeometry_geometry {
  __typename: "Geometry";
  label: string | null;
  wkt: string;
}

export interface NtasByBoroughQuery_ntas_byBoroughGeometry {
  __typename: "Feature";
  geometry: NtasByBoroughQuery_ntas_byBoroughGeometry_geometry;
  uri: string;
}

export interface NtasByBoroughQuery_ntas {
  __typename: "Ntas";
  byBoroughGeometry: NtasByBoroughQuery_ntas_byBoroughGeometry[];
}

export interface NtasByBoroughQuery {
  ntas: NtasByBoroughQuery_ntas;
}

export interface NtasByBoroughQueryVariables {
  uri: string;
}
