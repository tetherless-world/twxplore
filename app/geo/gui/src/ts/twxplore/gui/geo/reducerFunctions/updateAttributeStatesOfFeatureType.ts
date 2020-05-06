import {MapFeature} from "../states/map/MapFeature";
import {getFeatureAttributeStrategyByName} from "../attributeStrategies/functions/getFeatureAttributeStrategyByName";
import {MapFeatureAttributeState} from "../states/map/MapFeatureAttributeState/MapFeatureAttributeState";

export const updateAttributeStatesOfFeatureType = (
  attributeStatesOfFeatureType: {
    [featureAttributeName: string]: MapFeatureAttributeState;
  },
  addedFeature: MapFeature
) => {
  //Loop through the feature's attribute
  for (const attributeName of Object.keys(addedFeature)) {
    const FeatureAttribute = getFeatureAttributeStrategyByName(attributeName);
    FeatureAttribute.updateAttributeStatesOfFeatureType(
      attributeStatesOfFeatureType,
      addedFeature
    );
  }
};
