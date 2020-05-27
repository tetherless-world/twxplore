export enum FeatureAttributeName {
  label = "label",
  type = "type",
  uri = "uri",
  frequency = "frequency",
  timestamp = "timestamp",
  locality = "locality",
  postalcode = "postalcode",
  regions = "regions",
  transmissionPower = "transmissionPower",
  geometry = "geometry",
  frequencyString = "frequencyString",
  timestampString = "timestampString",
  transmissionPowerString = "transmissionPowerString",
  x = "x",
  y = "y",
}

export type FeatureAttributeKey = keyof typeof FeatureAttributeName;
