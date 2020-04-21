import {MapFeatureAttributeState} from "../states/map/MapFeatureAttributeState";
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
    //If the arttribute is numeric
    if (getFeatureAttributeByName(attributeName).isNumeric) {
      //If this is the first time coming across this attribute for this feature type
      if (
        !attributeStatesOfFeatureType[attributeName].min &&
        !attributeStatesOfFeatureType[attributeName].max
      ) {
        //New max of the attribute wil be the feature's value for the attribute
        attributeStatesOfFeatureType[attributeName].max = addedFeature[
          attributeKey
        ] as number;
        //New min of the attribute wil be the feature's value for the attribute
        attributeStatesOfFeatureType[attributeName].min = addedFeature[
          attributeKey
        ] as number;
        continue;
      }
      //If this is NOT the first time coming across this attribute for this feature type
      //Compare attribute value to the min found in the attribute state. Set new min if necessary.
      if (
        (addedFeature[attributeKey] as number) <
        attributeStatesOfFeatureType[attributeKey].min!
      )
        attributeStatesOfFeatureType[attributeKey].min = addedFeature[
          attributeKey
        ] as number;
      //Compare attribute value to the max found in the attribute state. Set new max if necessary.
      else if (
        (addedFeature[attributeKey] as number) >
        attributeStatesOfFeatureType[attributeKey].max!
      )
        attributeStatesOfFeatureType[attributeKey].max = addedFeature[
          attributeKey
        ] as number;
    }
  }
};
