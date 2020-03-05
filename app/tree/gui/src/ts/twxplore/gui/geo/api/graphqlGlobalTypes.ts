/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum CurbLoc {
  OffsetFromCurb = "OffsetFromCurb",
  OnCurb = "OnCurb",
}

export enum Guards {
  Harmful = "Harmful",
  Helpful = "Helpful",
  Unsure = "Unsure",
}

export enum Health {
  Fair = "Fair",
  Good = "Good",
  Poor = "Poor",
}

export enum Problems {
  BranchLights = "BranchLights",
  BranchOther = "BranchOther",
  BranchShoe = "BranchShoe",
  MetalGrates = "MetalGrates",
  RootGrate = "RootGrate",
  RootLights = "RootLights",
  RootOther = "RootOther",
  RootStone = "RootStone",
  Sneakers = "Sneakers",
  Stones = "Stones",
  TrunkLights = "TrunkLights",
  TrunkOther = "TrunkOther",
  TrunkWire = "TrunkWire",
  WiresRope = "WiresRope",
}

export enum Sidewalk {
  Damage = "Damage",
  NoDamage = "NoDamage",
}

export enum Status {
  Alive = "Alive",
  Dead = "Dead",
  Stump = "Stump",
}

export enum Steward {
  OneOrTwo = "OneOrTwo",
  ThreeOrFour = "ThreeOrFour",
}

export enum UserType {
  NYCParksStaff = "NYCParksStaff",
  TreesCountStaff = "TreesCountStaff",
  Volunteer = "Volunteer",
}

export interface SelectionInput {
  includeNtaList: string[];
  includeBlocks: string[];
  excludeNtaList: string[];
  excludeBlocks: string[];
}

//==============================================================
// END Enums and Input Objects
//==============================================================
