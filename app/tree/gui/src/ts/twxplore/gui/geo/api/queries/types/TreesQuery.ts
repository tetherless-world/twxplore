/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TreesQuery
// ====================================================

export interface TreesQuery_trees {
  __typename: "Tree";
  createdAt: string;
  dbh: number;
  stump: number;
  curbLoc: string;
  status: string;
  health: string | null;
  species: string | null;
  steward: string | null;
  guards: string | null;
  sidewalk: string | null;
  userType: string;
  problems: string[];
  address: string;
  city: string;
  community: number;
  cncldist: number;
  stateAssembly: number;
  stateSenate: number;
  boroughCount: number;
  latitude: number;
  longitude: number;
  x_sp: number;
  y_sp: number;
  bin: number | null;
  bbl: any | null;
  uri: string;
}

export interface TreesQuery {
  trees: TreesQuery_trees[];
}
