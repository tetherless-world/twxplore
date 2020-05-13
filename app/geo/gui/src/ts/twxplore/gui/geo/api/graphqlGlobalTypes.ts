/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum FeatureType {
  County = "County",
  MetropolitanDivision = "MetropolitanDivision",
  MilitaryInstallation = "MilitaryInstallation",
  Policy = "Policy",
  Root = "Root",
  State = "State",
  Transmission = "Transmission",
  Transmitter = "Transmitter",
}

export interface FeatureQuery {
  containsFeatureUri?: string | null;
  onlyFeatureUri?: string | null;
  types?: FeatureType[] | null;
  withinFeatureUri?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
