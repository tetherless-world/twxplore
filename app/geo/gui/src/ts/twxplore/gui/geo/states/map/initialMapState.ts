import {MapState} from "./MapState";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {MapFilterVariables} from "./MapFilterVariables";

const typesVisibility: {[index: string]: boolean} = {};
Object.values(FeatureType).map(type => {
  typesVisibility[type] = true;
});

const typesRanges: {[index: string]: MapFilterVariables} = {};

export const initialMapState: MapState = {
  keplerGlInstanceRegistered: false,
  features: [],
  typesVisibility: typesVisibility,
  typesRanges: typesRanges,
};
