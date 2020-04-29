import {MapStringFeatureAttributeState} from "../../../states/map/MapFeatureAttributeState/MapStringFeatureAttributeState";
import {MapFeatureAttributeState} from "../../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";

import {MapFeature} from "../../../states/map/MapFeature";

export const updateStringAttributeStatesOfFeatureType = (
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
  ] as MapStringFeatureAttributeState;
  //If this is the first time coming across this attribute for this feature type
  if (
    addedFeature[attributeKey] !== null &&
    !attributeStateOfFeatureType.values.includes(
      addedFeature[attributeKey] as string
    )
  ) {
    //add the value of the attribute into the values list of the attributeState
    attributeStateOfFeatureType.values.push(
      addedFeature[attributeKey] as string
    );
  }
  return;
};
