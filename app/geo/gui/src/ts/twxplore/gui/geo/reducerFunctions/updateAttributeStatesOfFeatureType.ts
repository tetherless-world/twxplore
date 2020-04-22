import {MapNumericFeatureAttributeState} from "../states/map/MapNumericFeatureAttributeState";
import {MapFeature} from "../states/map/MapFeature";
import {getFeatureAttributeByName} from "../attributeStrategies/getFeatureAttributeByName";

export const updateAttributeStatesOfFeatureType = (
  attributeStatesOfFeatureType: {
    [featureAttributeName: string]: MapFeatureAttributeState;
  },
  addedFeature: MapFeature
) => {
  //Loop through the feature's attribute
  for (const attributeName of Object.keys(addedFeature)) {
    const attributeKey = attributeName as keyof MapFeature;
    let attributeStateOfFeatureType =
      attributeStatesOfFeatureType[attributeName];
    //If the arttribute is numeric
    if (getFeatureAttributeByName(attributeName).isNumeric) {
      //If this is the first time coming across this attribute for this feature type
      if (
        attributeStateOfFeatureType.min === null &&
        attributeStateOfFeatureType.max === null
      ) {
        //New max of the attribute wil be the feature's value for the attribute
        attributeStateOfFeatureType.max = addedFeature[attributeKey] as number;
        //New min of the attribute wil be the feature's value for the attribute
        attributeStateOfFeatureType.min = addedFeature[attributeKey] as number;
        continue;
      }
      //If this is NOT the first time coming across this attribute for this feature type
      //Compare attribute value to the min found in the attribute state. Set new min if necessary.
      if (
        (addedFeature[attributeKey] as number) <
        attributeStateOfFeatureType.min!
      )
        attributeStateOfFeatureType.min = addedFeature[attributeKey] as number;
      //Compare attribute value to the max found in the attribute state. Set new max if necessary.
      else if (
        (addedFeature[attributeKey] as number) >
        attributeStateOfFeatureType.max!
      )
        attributeStateOfFeatureType.max = addedFeature[attributeKey] as number;
    }
  }
};
