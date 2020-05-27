/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FeatureQuery, FeatureType } from "./../../graphqlGlobalTypes";

// ====================================================
// GraphQL query operation: MapFeaturesQuery
// ====================================================

export interface MapFeaturesQuery_features_geometry_parsedWkt_Line {
  __typename: "Line" | "MultiLine" | "MultiPoint";
}

export interface MapFeaturesQuery_features_geometry_parsedWkt_Point {
  __typename: "Point";
  x: number;
  y: number;
}

export interface MapFeaturesQuery_features_geometry_parsedWkt_Polygon {
  __typename: "Polygon";
  lines: number[][];
}

export interface MapFeaturesQuery_features_geometry_parsedWkt_MultiPolygon_polygons {
  __typename: "Polygon";
  lines: number[][];
}

export interface MapFeaturesQuery_features_geometry_parsedWkt_MultiPolygon {
  __typename: "MultiPolygon";
  polygons: MapFeaturesQuery_features_geometry_parsedWkt_MultiPolygon_polygons[];
}

export type MapFeaturesQuery_features_geometry_parsedWkt = MapFeaturesQuery_features_geometry_parsedWkt_Line | MapFeaturesQuery_features_geometry_parsedWkt_Point | MapFeaturesQuery_features_geometry_parsedWkt_Polygon | MapFeaturesQuery_features_geometry_parsedWkt_MultiPolygon;

export interface MapFeaturesQuery_features_geometry {
  __typename: "ParsedGeometry";
  label: string | null;
  uri: string;
  parsedWkt: MapFeaturesQuery_features_geometry_parsedWkt;
}

export interface MapFeaturesQuery_features {
  __typename: "Feature";
  label: string | null;
  type: FeatureType | null;
  uri: string;
  frequency: number | null;
  timestamp: number | null;
  locality: string | null;
  postalCode: string | null;
  regions: string[];
  transmissionPower: number | null;
  geometry: MapFeaturesQuery_features_geometry;
}

export interface MapFeaturesQuery {
  features: MapFeaturesQuery_features[];
}

export interface MapFeaturesQueryVariables {
  query: FeatureQuery;
  limit?: number | null;
  offset?: number | null;
}
