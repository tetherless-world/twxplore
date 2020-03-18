import {createSelector} from "reselect";
import {MapFeature} from "../states/map/MapFeature";
import {getFeatures} from "./getFeatures";

export const getFeaturesByState = createSelector(
  getFeatures,
  (features: MapFeature[]) => {
    const featuresByState: {[index: string]: MapFeature[]} = {};
    for (const feature of features) {
      const features = featuresByState[feature.state];
      if (features) {
        features.push(feature);
      } else {
        featuresByState[feature.state] = [feature];
      }
    }
    return featuresByState;
  }
);
