/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { SelectionInput, CurbLoc, Status, Health, Steward, Guards, Sidewalk, UserType, Problems } from "./../../../../geo/api/graphqlGlobalTypes";

// ====================================================
// GraphQL query operation: TreeMapQuery
// ====================================================

export interface TreeMapQuery_treesBySelection_blocks {
  __typename: "Block";
  id: number;
  name: string;
  uri: string;
}

export interface TreeMapQuery_treesBySelection_boroughs {
  __typename: "Borough";
  borocode: number;
  name: string;
  city: string;
  ntaList: string[];
  uri: string;
}

export interface TreeMapQuery_treesBySelection_censusTracts {
  __typename: "CensusTract";
  id: number;
  uri: string;
}

export interface TreeMapQuery_treesBySelection_city {
  __typename: "City";
  name: string;
  boroughs: string[];
  postcodes: string[];
  state: string;
  uri: string;
}

export interface TreeMapQuery_treesBySelection_ntaList {
  __typename: "Nta";
  nta: string;
  name: string;
  blocks: string[];
  borough: string;
  postCode: string;
  uri: string;
}

export interface TreeMapQuery_treesBySelection_postcodes {
  __typename: "Postcode";
  code: number;
  city: string;
  uri: string;
}

export interface TreeMapQuery_treesBySelection_state {
  __typename: "State";
  name: string;
  cities: string[];
  uri: string;
}

export interface TreeMapQuery_treesBySelection_trees {
  __typename: "Tree";
  createdAt: string;
  dbh: number;
  stump: number;
  curbLoc: CurbLoc;
  status: Status;
  health: Health | null;
  species: string | null;
  steward: Steward | null;
  guards: Guards | null;
  sidewalk: Sidewalk | null;
  userType: UserType;
  problems: Problems[];
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

export interface TreeMapQuery_treesBySelection_treeSpecies {
  __typename: "TreeSpecies";
  common: string;
  latin: string;
  uri: string;
}

export interface TreeMapQuery_treesBySelection_zipCities {
  __typename: "ZipCity";
  city: string;
  uri: string;
}

export interface TreeMapQuery_treesBySelection {
  __typename: "SelectionResults";
  blocks: TreeMapQuery_treesBySelection_blocks[];
  boroughs: TreeMapQuery_treesBySelection_boroughs[];
  censusTracts: TreeMapQuery_treesBySelection_censusTracts[];
  city: TreeMapQuery_treesBySelection_city;
  ntaList: TreeMapQuery_treesBySelection_ntaList[];
  postcodes: TreeMapQuery_treesBySelection_postcodes[];
  state: TreeMapQuery_treesBySelection_state;
  trees: TreeMapQuery_treesBySelection_trees[];
  treeSpecies: TreeMapQuery_treesBySelection_treeSpecies[];
  zipCities: TreeMapQuery_treesBySelection_zipCities[];
}

export interface TreeMapQuery {
  treesBySelection: TreeMapQuery_treesBySelection;
}

export interface TreeMapQueryVariables {
  selectionInput: SelectionInput;
}
