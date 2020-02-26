/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SelectionHierarchyQuery
// ====================================================

export interface SelectionHierarchyQuery_getBlockHierarchy {
  __typename: "SelectionArea";
  name: string;
  uri: string;
  parent: string;
}

export interface SelectionHierarchyQuery {
  getBlockHierarchy: SelectionHierarchyQuery_getBlockHierarchy[];
}

export interface SelectionHierarchyQueryVariables {
  uri: string;
}
