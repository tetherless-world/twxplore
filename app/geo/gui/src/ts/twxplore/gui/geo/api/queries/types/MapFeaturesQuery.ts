/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FeatureQuery, FeatureType } from "./../../graphqlGlobalTypes";

// ====================================================
// GraphQL query operation: MapFeaturesQuery
// ====================================================

export interface MapFeaturesQuery_features_geometry_parsedWkt_Line {
  __typename: "Line" | "Polygon" | "MultiLine" | "MultiPoint" | "MultiPolygon";
}

export interface MapFeaturesQuery_features_geometry_parsedWkt_Point2D {
  __typename: "Point2D";
  x: number;
  y: number;
}

export type MapFeaturesQuery_features_geometry_parsedWkt = MapFeaturesQuery_features_geometry_parsedWkt_Line | MapFeaturesQuery_features_geometry_parsedWkt_Point2D;

export interface MapFeaturesQuery_features_geometry {
  __typename: "ParsedGeometry";
  label: string | null;
  wkt: string;
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
  frequencyUnit: string | null;
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
