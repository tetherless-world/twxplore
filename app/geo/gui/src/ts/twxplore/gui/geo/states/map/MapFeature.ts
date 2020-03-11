import { FeaturesQuery_features } from "../../api/queries/types/FeaturesQuery";
import { MapFeatureState } from "./MapFeatureState";


export interface MapFeature extends FeaturesQuery_features
{
  state: MapFeatureState
}

