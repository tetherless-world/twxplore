import {MapNumericFeatureAttributeState} from "../../../states/map/MapFeatureAttributeState/MapNumericFeatureAttributeState";
import {MapFeatureAttributeState} from "../../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";

import {MapFeature} from "../../../states/map/MapFeature";

export const updateNumericAttributeStatesOfFeatureType = (
  attributeStatesOfFeatureType: {
    [featureAttributeName: string]: MapFeatureAttributeState;
  },
  addedFeature: MapFeature,
  attributeName: string
) => {
  const attributeKey = attributeName as keyof MapFeature;
  //Specifying the exact attribute state to be updated.
  let attributeStateOfFeatureType = attributeStatesOfFeatureType[
    attributeName
  ] as MapNumericFeatureAttributeState;
  //If this is the first time coming across this attribute for this feature type
  if (
    attributeStateOfFeatureType.min === null &&
    attributeStateOfFeatureType.max === null
  ) {
    //New max of the attribute wil be the feature's value for the attribute
    attributeStateOfFeatureType.max = addedFeature[attributeKey] as number;
    //New min of the attribute wil be the feature's value for the attribute
    attributeStateOfFeatureType.min = addedFeature[attributeKey] as number;
    return;
  }
  //If this is NOT the first time coming across this attribute for this feature type
  //Compare attribute value to the min found in the attribute state. Set new min if necessary.
  if ((addedFeature[attributeKey] as number) < attributeStateOfFeatureType.min!)
    attributeStateOfFeatureType.min = addedFeature[attributeKey] as number;
  //Compare attribute value to the max found in the attribute state. Set new max if necessary.
  else if (
    (addedFeature[attributeKey] as number) > attributeStateOfFeatureType.max!
  )
    attributeStateOfFeatureType.max = addedFeature[attributeKey] as number;
  return;
};
