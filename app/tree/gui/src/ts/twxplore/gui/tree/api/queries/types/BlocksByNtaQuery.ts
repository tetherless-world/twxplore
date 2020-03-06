/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BlocksByNtaQuery
// ====================================================

export interface BlocksByNtaQuery_blocks_byNtaGeometry_geometry {
  __typename: "Geometry";
  label: string | null;
  wkt: string;
}

export interface BlocksByNtaQuery_blocks_byNtaGeometry {
  __typename: "Feature";
  geometry: BlocksByNtaQuery_blocks_byNtaGeometry_geometry;
  uri: string;
}

export interface BlocksByNtaQuery_blocks {
  __typename: "Blocks";
  byNtaGeometry: BlocksByNtaQuery_blocks_byNtaGeometry[];
}

export interface BlocksByNtaQuery {
  blocks: BlocksByNtaQuery_blocks;
}

export interface BlocksByNtaQueryVariables {
  uri: string;
}
