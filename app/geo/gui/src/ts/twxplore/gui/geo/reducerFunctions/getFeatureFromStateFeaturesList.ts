import {MapFeature} from "../states/map/MapFeature";

export const getFeatureFromStateFeaturesList = (
  featuresList: MapFeature[],
  featureUri: string
) => {
  return featuresList.find(({uri}) => uri === featureUri);
};
