/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BoroughsQuery
// ====================================================

export interface BoroughsQuery_boroughs_geometries_geometry {
  __typename: "Geometry";
  label: string | null;
  wkt: string;
}

export interface BoroughsQuery_boroughs_geometries {
  __typename: "Feature";
  geometry: BoroughsQuery_boroughs_geometries_geometry;
  uri: string;
}

export interface BoroughsQuery_boroughs {
  __typename: "Boroughs";
  geometries: BoroughsQuery_boroughs_geometries[];
}

export interface BoroughsQuery {
  boroughs: BoroughsQuery_boroughs;
}
