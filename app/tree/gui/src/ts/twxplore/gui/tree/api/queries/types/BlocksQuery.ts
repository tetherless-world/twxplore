/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BlocksQuery
// ====================================================

export interface BlocksQuery_blocks_geometries_geometry {
  __typename: "Geometry";
  label: string | null;
  wkt: string;
}

export interface BlocksQuery_blocks_geometries {
  __typename: "Feature";
  geometry: BlocksQuery_blocks_geometries_geometry;
  uri: string;
}

export interface BlocksQuery_blocks {
  __typename: "Blocks";
  geometries: BlocksQuery_blocks_geometries[];
}

export interface BlocksQuery {
  blocks: BlocksQuery_blocks;
}
