import {MapFeatureAttributeState} from "../../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {FeatureAttributeName} from "../../../states/map/FeatureAttributeName";

export const buildInitialFeatureAttributeStateNumeric = (
  attributeStatesOfFeatureType: {
    [featureAttributeName: string]: MapFeatureAttributeState;
  },
  featureAttributeName: FeatureAttributeName
) => {
  attributeStatesOfFeatureType[featureAttributeName] = {
    min: null,
    max: null,
    filterIndex: null,
  };
};
