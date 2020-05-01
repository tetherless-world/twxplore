/*
Originally named a filterStateOfType. Renamed MapFeatureAttributeState because it represents
the state (min, max, filterIndex) of an attribute for features of a FeatureType. 

For example, can be used to track the min/max/filterIndex of the 'frequency' attribute for features of FeatureType 'Transmission'.
This is important info that will be used for setting filter values.

Unsure, if I should call this FeatureTypeAttributeState instead.
Or maybe 'AttributeOfFeatureTypeState'
*/
export interface MapNumericFeatureAttributeState {
  range: MapFeatureAttributeNumericRange;
  filterIndex: number | null;
}

interface MapFeatureAttributeNumericRange {
  min: number | null;
  max: number | null;
}
