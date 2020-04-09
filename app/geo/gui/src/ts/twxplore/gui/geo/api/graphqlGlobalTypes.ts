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
  Transmission = "Transmission",
  Transmitter = "Transmitter",
}

export interface FeatureQuery {
  containsFeatureUri?: string | null;
  types?: FeatureType[] | null;
  withinFeatureUri?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
