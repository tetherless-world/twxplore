import {MapFeature} from "../states/map/MapFeature";
import {getFeatureAttributeByName} from "../attributeStrategies/getFeatureAttributeByName";
import {MapFeatureAttributeState} from "../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {MapNumericFeatureAttributeState} from "../states/map/MapFeatureAttributeState/MapNumericFeatureAttributeState";
import {MapStringFeatureAttributeState} from "../states/map/MapFeatureAttributeState/MapStringFeatureAttributeState";

export const updateAttributeStatesOfFeatureType = (
  attributeStatesOfFeatureType: {
    [featureAttributeName: string]: MapFeatureAttributeState;
  },
  addedFeature: MapFeature
) => {
  //Loop through the feature's attribute
  for (const attributeName of Object.keys(addedFeature)) {
    const attributeKey = attributeName as keyof MapFeature;
    //Specifying the exact attribute state to be updated.
    let attributeStateOfFeatureType =
      attributeStatesOfFeatureType[attributeName];
    //If the attribute is numeric
    if (getFeatureAttributeByName(attributeName).isNumeric) {
      attributeStateOfFeatureType = attributeStateOfFeatureType as MapNumericFeatureAttributeState;
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
    //If the attribute is a string e.g. locality, label
    else if (getFeatureAttributeByName(attributeName).isString) {
      //Interpret this attributeState as a MapSTRINGFeatureAttributeState
      attributeStateOfFeatureType = attributeStateOfFeatureType as MapStringFeatureAttributeState;
      //if the value of the attribute for this feature, e.g. locality = "EastWood", is not already present in the attributeState
      if (
        !attributeStateOfFeatureType.values.includes(
          addedFeature[attributeKey] as string
        )
      ) {
        //add the value of the attribute into the values list of the attributeState
        attributeStateOfFeatureType.values.push();
      }
    }
  }
};
