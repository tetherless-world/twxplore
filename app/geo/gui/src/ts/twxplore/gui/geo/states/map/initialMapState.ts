import {MapState} from "./MapState";
import {FeatureType} from "../../api/graphqlGlobalTypes";

const typesVisibility: {[index: string]: boolean} = {};
Object.values(FeatureType).map(type => {
  typesVisibility[type] = true;
});

export const initialMapState: MapState = {
  keplerGlInstanceRegistered: false,
  features: [],
  typesVisibility: typesVisibility,
};
