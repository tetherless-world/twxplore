/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NtasQuery
// ====================================================

export interface NtasQuery_ntas_geometries_geometry {
  __typename: "Geometry";
  label: string | null;
  wkt: string;
}

export interface NtasQuery_ntas_geometries {
  __typename: "SelectionGeometry";
  geometry: NtasQuery_ntas_geometries_geometry;
  uri: string;
}

export interface NtasQuery_ntas {
  __typename: "Ntas";
  geometries: NtasQuery_ntas_geometries[];
}

export interface NtasQuery {
  ntas: NtasQuery_ntas;
}
