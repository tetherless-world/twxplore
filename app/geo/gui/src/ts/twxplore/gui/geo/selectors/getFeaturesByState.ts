import {MapFeature} from "../states/map/MapFeature";
import {RootState} from "../states/root/RootState";

export const getFeaturesByState = (state: RootState) => {
  const featuresByState: {[index: string]: MapFeature[]} = {};
  for (const feature of state.app.map.features) {
    const features = featuresByState[feature.state];
    if (features) {
      features.push(feature);
    } else {
      featuresByState[feature.state] = [feature];
    }
  }
  return featuresByState;
};
