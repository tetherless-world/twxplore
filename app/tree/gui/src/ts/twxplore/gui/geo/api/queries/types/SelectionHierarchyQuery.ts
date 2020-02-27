/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SelectionHierarchyQuery
// ====================================================

export interface SelectionHierarchyQuery_blocks_hierarchy {
  __typename: "SelectionArea";
  name: string;
  uri: string;
  parent: string;
}

export interface SelectionHierarchyQuery_blocks {
  __typename: "Blocks";
  hierarchy: SelectionHierarchyQuery_blocks_hierarchy[];
}

export interface SelectionHierarchyQuery {
  blocks: SelectionHierarchyQuery_blocks;
}

export interface SelectionHierarchyQueryVariables {
  uri: string;
}
