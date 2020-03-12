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
  UlsEntity = "UlsEntity",
}

export interface FeatureQuery {
  containsFeatureUri?: string | null;
  type?: FeatureType | null;
  withinFeatureUri?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
