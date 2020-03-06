/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import {SelectionInputFieldsInput} from "./../../graphqlGlobalTypes";

// ====================================================
// GraphQL query operation: ResultsQuery
// ====================================================

export interface ResultsQuery_getTreesBySelection_blocks {
  __typename: "Block";
  id: number;
  name: string;
  uri: string;
}

export interface ResultsQuery_getTreesBySelection_boroughs {
  __typename: "Borough";
  borocode: number;
  name: string;
  city: string;
  ntaList: string[];
  uri: string;
}

export interface ResultsQuery_getTreesBySelection_censusTracts {
  __typename: "CensusTract";
  id: number;
  uri: string;
}

export interface ResultsQuery_getTreesBySelection_city {
  __typename: "City";
  name: string;
  boroughs: string[];
  postcodes: string[];
  state: string;
  uri: string;
}

export interface ResultsQuery_getTreesBySelection_ntaList {
  __typename: "Nta";
  nta: string;
  name: string;
  blocks: string[];
  borough: string;
  postCode: string;
  uri: string;
}

export interface ResultsQuery_getTreesBySelection_postcodes {
  __typename: "Postcode";
  code: number;
  city: string;
  uri: string;
}

export interface ResultsQuery_getTreesBySelection_state {
  __typename: "State";
  name: string;
  cities: string[];
  uri: string;
}

export interface ResultsQuery_getTreesBySelection_trees {
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

export interface ResultsQuery_getTreesBySelection_treeSpecies {
  __typename: "TreeSpecies";
  common: string;
  latin: string;
  uri: string;
}

export interface ResultsQuery_getTreesBySelection_zipCities {
  __typename: "ZipCity";
  city: string;
  uri: string;
}

export interface ResultsQuery_getTreesBySelection {
  __typename: "SelectionResults";
  blocks: ResultsQuery_getTreesBySelection_blocks[];
  boroughs: ResultsQuery_getTreesBySelection_boroughs[];
  censusTracts: ResultsQuery_getTreesBySelection_censusTracts[];
  city: ResultsQuery_getTreesBySelection_city;
  ntaList: ResultsQuery_getTreesBySelection_ntaList[];
  postcodes: ResultsQuery_getTreesBySelection_postcodes[];
  state: ResultsQuery_getTreesBySelection_state;
  trees: ResultsQuery_getTreesBySelection_trees[];
  treeSpecies: ResultsQuery_getTreesBySelection_treeSpecies[];
  zipCities: ResultsQuery_getTreesBySelection_zipCities[];
}

export interface ResultsQuery {
  getTreesBySelection: ResultsQuery_getTreesBySelection;
}

export interface ResultsQueryVariables {
  selectionInput: SelectionInputFieldsInput;
}
