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
  //Specifying the AttributeState to be updated based on the attribute of addedFeature that is being compared/analyzed
  let attributeStateOfAttributeOfFeatureType = attributeStatesOfFeatureType[
    attributeName
  ] as MapStringFeatureAttributeState;
  //If this is the first time coming across this attribute for this feature type
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
  //add the value of the attribute of the addedFeature into the values list of the attributeState if the value is not null and is not already included.
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
