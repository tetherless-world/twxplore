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
    !attributeStateOfFeatureType
    //addedFeature[attributeKey] !== null &&
    //!attributeStateOfFeatureType.values.includes(
    //addedFeature[attributeKey] as string
  ) {
    attributeStatesOfFeatureType[attributeName] = {
      values: [],
      filterIndex: null,
    };
    attributeStateOfFeatureType = attributeStatesOfFeatureType[
      attributeName
    ] as MapStringFeatureAttributeState;
  }
  //add the value of the attribute into the values list of the attributeState
  if (
    addedFeature[attributeKey] !== null &&
    !attributeStateOfFeatureType.values.includes(
      addedFeature[attributeKey] as string
    )
  )
    attributeStateOfFeatureType.values.push(
      addedFeature[attributeKey] as string
    );

  return;
};
