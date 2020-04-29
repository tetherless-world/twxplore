import {MapNumericFeatureAttributeState} from "../../../states/map/MapFeatureAttributeState/MapNumericFeatureAttributeState";
import {MapFeatureAttributeState} from "../../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";

import {MapFeature} from "../../../states/map/MapFeature";

export const updateNumericAttributeStateOfFeatureType = (
  attributeStatesOfFeatureType: {
    [featureAttributeName: string]: MapFeatureAttributeState;
  },
  addedFeature: MapFeature,
  attributeName: string
) => {
  const attributeKey = attributeName as keyof MapFeature;
  //Specifying the attribute state of the addedFeature's FeatureType to be updated (e.g. the attribute state of 'frequency' of Transmissions)
  let attributeStateOfAttributeOffFeatureType = attributeStatesOfFeatureType[
    attributeName
  ] as MapNumericFeatureAttributeState;
  //If this is the first time coming across this attribute for the addedFeature's FeatureType
  if (!attributeStateOfAttributeOffFeatureType) {
    //Give the MapNumericAttributeState a temporary default value
    attributeStatesOfFeatureType[attributeName] = {
      range: {min: null, max: null},
      filterIndex: null,
    };
    attributeStateOfAttributeOffFeatureType = attributeStatesOfFeatureType[
      attributeName
    ] as MapNumericFeatureAttributeState;
    //New max of the attribute wil be the feature's value for the attribute
    attributeStateOfAttributeOffFeatureType.range.max = addedFeature[
      attributeKey
    ] as number;
    //New min of the attribute wil be the feature's value for the attribute
    attributeStateOfAttributeOffFeatureType.range.min = addedFeature[
      attributeKey
    ] as number;
    return;
  }
  //If this is NOT the first time coming across this attribute for the addedFeature's FeatureType
  //Compare attribute value of addedFeature to the min found in the attribute state. Set new min if necessary.
  if (
    (addedFeature[attributeKey] as number) <
    attributeStateOfAttributeOffFeatureType.range.min!
  )
    attributeStateOfAttributeOffFeatureType.range.min = addedFeature[
      attributeKey
    ] as number;
  //Compare attribute value to the max found in the attribute state. Set new max if necessary.
  else if (
    (addedFeature[attributeKey] as number) >
    attributeStateOfAttributeOffFeatureType.range.max!
  )
    attributeStateOfAttributeOffFeatureType.range.max = addedFeature[
      attributeKey
    ] as number;
  return;
};
