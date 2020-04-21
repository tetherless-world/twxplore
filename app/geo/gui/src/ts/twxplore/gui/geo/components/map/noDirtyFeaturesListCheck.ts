import {FeaturesByType} from "../../states/map/FeaturesByType";
import {FeatureType} from "../../api/graphqlGlobalTypes";

//Returns true if none of the featuresByType values are dirty
export const noDirtyFeaturesListCheck = (featuresByType: {
  [featureType: string]: FeaturesByType;
}) => {
  for (const featureType of Object.values(FeatureType)) {
    //Check if filters need to be added for this FeatureType
    if (featuresByType[featureType].dirty) return false;
  }
  return true;
};
