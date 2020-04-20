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
  for (const attribute of Object.keys(addedFeature)) {
    //If the arttribute is numeric
    if (getFeatureAttributeByName(attribute).isNumeric) {
      //If this is the first time coming across this attribute for this feature type
      if (
        !attributeStatesOfFeatureType[attribute].min &&
        !attributeStatesOfFeatureType[attribute].min
      ) {
        //New max of the attribute wil be the feature's value for the attribute
        attributeStatesOfFeatureType[attribute].max = (addedFeature as any)[
          attribute
        ];
        //New min of the attribute wil be the feature's value for the attribute
        attributeStatesOfFeatureType[attribute].min = (addedFeature as any)[
          attribute
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
