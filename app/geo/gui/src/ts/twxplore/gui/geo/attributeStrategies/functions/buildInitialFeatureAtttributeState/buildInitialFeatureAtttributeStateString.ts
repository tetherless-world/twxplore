import {MapFeatureAttributeState} from "../../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {MapStringFeatureAttributeState} from "../../../states/map/MapFeatureAttributeState/MapStringFeatureAttributeState";
import {FeatureAttributeName} from "../../../states/map/FeatureAttributeName";

export const buildInitialFeatureAttributeStateString = (
  attributeStatesOfFeatureType: {
    [featureAttributeName: string]: MapFeatureAttributeState;
  },
  featureAttributeName: FeatureAttributeName
) => {
  let attributeStateOfFeatureType = attributeStatesOfFeatureType[
    featureAttributeName
  ] as MapStringFeatureAttributeState;
  attributeStateOfFeatureType = {
    values: [],
    filterIndex: null,
  };
};
