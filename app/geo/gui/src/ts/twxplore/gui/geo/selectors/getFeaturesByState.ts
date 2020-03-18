import {createSelector} from "reselect";
import {MapFeature} from "../states/map/MapFeature";
import {RootState} from "../states/root/RootState";

export const getFeaturesByState = createSelector(
  (state: RootState) => state.app.map.features,
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
