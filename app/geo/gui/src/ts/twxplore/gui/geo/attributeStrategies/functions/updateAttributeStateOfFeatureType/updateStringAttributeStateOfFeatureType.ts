import {MapStringFeatureAttributeState} from "../../../states/map/MapFeatureAttributeState/MapStringFeatureAttributeState";
import {MapFeatureAttributeState} from "../../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";

import {MapFeature} from "../../../states/map/MapFeature";

export const updateStringAttributeStateOfFeatureType = (
  attributeStatesOfFeatureType: {
    [featureAttributeName: string]: MapFeatureAttributeState;
  },
  addedFeature: MapFeature,
  attributeName: string
) => {
  const attributeKey = attributeName as keyof MapFeature;
  //Specifying the attribute state of the addedFeature's FeatureType to be updated (e.g. the state of 'frequency' of Transmissions)

  let attributeStateOfAttributeOfFeatureType = attributeStatesOfFeatureType[
    attributeName
  ] as MapStringFeatureAttributeState;
  //If this is the first time coming across this attribute for the addedFeature's FeatureType
  if (!attributeStateOfAttributeOfFeatureType) {
    //Give the attribute a default MapStringFeatureAttributeState
    attributeStatesOfFeatureType[attributeName] = {
      values: [],
      filterIndex: null,
    };
    attributeStateOfAttributeOfFeatureType = attributeStatesOfFeatureType[
      attributeName
    ] as MapStringFeatureAttributeState;
  }
  //add the value of addedFeature's attribute into the values list of the attribute state if the value is not null and is not already included.
  if (
    addedFeature[attributeKey] !== null &&
    !attributeStateOfAttributeOfFeatureType.values.includes(
      addedFeature[attributeKey] as string
    )
  )
    attributeStateOfAttributeOfFeatureType.values.push(
      addedFeature[attributeKey] as string
    );

  return;
};
