import {MapFeature} from "twxplore/gui/tree/states/map/MapFeature";

export interface MapState {
  keplerGlInstanceRegistered: boolean;
  features: MapFeature[];
}
