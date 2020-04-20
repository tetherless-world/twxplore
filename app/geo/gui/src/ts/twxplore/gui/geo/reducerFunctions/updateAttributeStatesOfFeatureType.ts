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
    //If the arttribute is numeric
    if (getFeatureAttributeByName(attributeName).isNumeric) {
      //If this is the first time coming across this attribute for this feature type
      if (
        !attributeStatesOfFeatureType[attributeName].min &&
        !attributeStatesOfFeatureType[attributeName].max
      ) {
        //New max of the attribute wil be the feature's value for the attribute
        attributeStatesOfFeatureType[attributeName].max = (addedFeature as any)[
          attributeName
        ];
        //New min of the attribute wil be the feature's value for the attribute
        attributeStatesOfFeatureType[attributeName].min = (addedFeature as any)[
          attributeName
        ];
      }
      //If this is NOT the first time coming across this attribute for this feature type
      else {
        //Compare attribute value to the min found in the attribute state. Set new min if necessary.
        if (
          (addedFeature as any)[attribute] <
          attributeStatesOfFeatureType[attribute].min!
        )
          attributeStatesOfFeatureType[attribute].min = (addedFeature as any)[
            attribute
          ];
        //Compare attribute value to the max found in the attribute state. Set new max if necessary.
        else if (
          (addedFeature as any)[attribute] >
          attributeStatesOfFeatureType[attribute].max!
        )
          attributeStatesOfFeatureType[attribute].max = (addedFeature as any)[
            attribute
          ];
      }
    }
  }
};
