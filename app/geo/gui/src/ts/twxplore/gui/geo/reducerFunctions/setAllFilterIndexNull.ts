import {MapFeatureAttributeState} from "../states/map/MapFeatureAttributeState";

export const setAllFilterIndexNull = (attributeStatesOfFeatureType: {
  [featureAttributeName: string]: MapFeatureAttributeState;
}) => {
  Object.keys(attributeStatesOfFeatureType).map(attributeName => {
    //Set the filter index for all attributes within the filter to null because filter are being removed
    attributeStatesOfFeatureType[attributeName].filterIndex = null;
  });
};
