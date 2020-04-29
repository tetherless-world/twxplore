import {MapFeature} from "../states/map/MapFeature";
import {getFeatureAttributeByName} from "../attributeStrategies/functions/getFeatureAttributeByName";
import {MapFeatureAttributeState} from "../states/map/MapFeatureAttributeState/MapFeatureAttributeState";

export const updateAttributeStatesOfFeatureType = (
  attributeStatesOfFeatureType: {
    [featureAttributeName: string]: MapFeatureAttributeState;
  },
  addedFeature: MapFeature
) => {
  //Loop through the feature's attribute
  for (const attributeName of Object.keys(addedFeature)) {
    const FeatureAttribute = getFeatureAttributeByName(attributeName);
    FeatureAttribute.updateAttributeStatesOfFeatureType(
      attributeStatesOfFeatureType,
      addedFeature
    );
  }
};
