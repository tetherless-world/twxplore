import {MapFeatureType} from "twxplore/gui/tree/states/map/MapFeatureType";
import {MapFeatureState} from "twxplore/gui/tree/states/map/MapFeatureState";

export interface MapFeature {
  childType?: MapFeatureType;
  geometry: {
    wkt: string;
  };
  label?: string | null;
  parentUri?: string;
  state: MapFeatureState;
  type: MapFeatureType;
  uri: string;
}
