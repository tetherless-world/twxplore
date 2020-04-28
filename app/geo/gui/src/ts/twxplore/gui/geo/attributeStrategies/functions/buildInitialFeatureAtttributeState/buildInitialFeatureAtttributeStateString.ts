import {MapFeatureAttributeState} from "../../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {FeatureAttributeName} from "../../../states/map/FeatureAttributeName";

export const buildInitialFeatureAttributeStateString = (
  attributeStatesOfFeatureType: {
    [featureAttributeName: string]: MapFeatureAttributeState;
  },
  featureAttributeName: FeatureAttributeName
) => {
  attributeStatesOfFeatureType[featureAttributeName] = {
    values: [],
    filterIndex: null,
  };
};
