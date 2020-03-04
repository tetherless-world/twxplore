import {MapFeatureType} from "twxplore/gui/geo/states/map/MapFeatureType";
import {MapFeatureState} from "twxplore/gui/geo/states/map/MapFeatureState";

export interface MapFeature {
   childType?: MapFeatureType;
   geometry: {
      wkt: string;
   }
   label?: string | null;
   parentUri?: string;
   state: MapFeatureState;
   type: MapFeatureType;
   uri: string;
}
