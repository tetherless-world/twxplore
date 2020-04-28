import {MapFeatureAttributeState} from "../../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {MapNumericFeatureAttributeState} from "../../../states/map/MapFeatureAttributeState/MapNumericFeatureAttributeState";
import {FeatureAttributeName} from "../../../states/map/FeatureAttributeName";

export const buildInitialFeatureAttributeStateNumeric = (
  attributeStatesOfFeatureType: {
    [featureAttributeName: string]: MapFeatureAttributeState;
  },
  featureAttributeName: FeatureAttributeName
) => {
  let attributeStateOfFeatureType = attributeStatesOfFeatureType[
    featureAttributeName
  ] as MapNumericFeatureAttributeState;
  attributeStateOfFeatureType = {
    min: null,
    max: null,
    filterIndex: null,
  };
};
