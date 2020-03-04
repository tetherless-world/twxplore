import {MapFeatureState} from "twxplore/gui/geo/components/map/MapFeatureState";
import {MapFeatureType} from "twxplore/gui/geo/components/map/MapFeatureType";

export interface MapFeature {
   childType?: MapFeatureType;
   label?: string | null;
   parentUri: string;
   state: MapFeatureState;
   type: MapFeatureType;
   uri: string;
}
