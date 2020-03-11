/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum FeatureType {
  MetropolitanDivision = "MetropolitanDivision",
  MilitaryInstallation = "MilitaryInstallation",
  State = "State",
}

export interface FeatureQuery {
  containsWkt?: string | null;
  type?: FeatureType | null;
  withinWkt?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
