/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { SelectionInputFieldsInput } from "./../../graphqlGlobalTypes";

// ====================================================
// GraphQL query operation: TreeMapQuery
// ====================================================

export interface TreeMapQuery_TreesBySelection_blocks {
  __typename: "Block";
  id: number;
  name: string;
  uri: string;
}

export interface TreeMapQuery_TreesBySelection_boroughs {
  __typename: "Borough";
  borocode: number;
  name: string;
  city: string;
  ntaList: string[];
  uri: string;
}

export interface TreeMapQuery_TreesBySelection_censusTracts {
  __typename: "CensusTract";
  id: number;
  uri: string;
}

export interface TreeMapQuery_TreesBySelection_city {
  __typename: "City";
  name: string;
  boroughs: string[];
  postcodes: string[];
  state: string;
  uri: string;
}

export interface TreeMapQuery_TreesBySelection_ntaList {
  __typename: "Nta";
  nta: string;
  name: string;
  blocks: string[];
  borough: string;
  postCode: string;
  uri: string;
}

export interface TreeMapQuery_TreesBySelection_postcodes {
  __typename: "Postcode";
  code: number;
  city: string;
  uri: string;
}

export interface TreeMapQuery_TreesBySelection_state {
  __typename: "State";
  name: string;
  cities: string[];
  uri: string;
}

export interface TreeMapQuery_TreesBySelection_trees {
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

export interface TreeMapQuery_TreesBySelection_treeSpecies {
  __typename: "TreeSpecies";
  common: string;
  latin: string;
  uri: string;
}

export interface TreeMapQuery_TreesBySelection_zipCities {
  __typename: "ZipCity";
  city: string;
  uri: string;
}

export interface TreeMapQuery_TreesBySelection {
  __typename: "SelectionResults";
  blocks: TreeMapQuery_TreesBySelection_blocks[];
  boroughs: TreeMapQuery_TreesBySelection_boroughs[];
  censusTracts: TreeMapQuery_TreesBySelection_censusTracts[];
  city: TreeMapQuery_TreesBySelection_city;
  ntaList: TreeMapQuery_TreesBySelection_ntaList[];
  postcodes: TreeMapQuery_TreesBySelection_postcodes[];
  state: TreeMapQuery_TreesBySelection_state;
  trees: TreeMapQuery_TreesBySelection_trees[];
  treeSpecies: TreeMapQuery_TreesBySelection_treeSpecies[];
  zipCities: TreeMapQuery_TreesBySelection_zipCities[];
}

export interface TreeMapQuery {
  TreesBySelection: TreeMapQuery_TreesBySelection;
}

export interface TreeMapQueryVariables {
  selectionInput: SelectionInputFieldsInput;
}
