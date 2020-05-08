import {MapState} from "./MapState";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {FeaturesByType} from "./FeaturesByType";
import {MapFeatureTypeState} from "./MapFeatureTypeState";
import {FeatureAttributeName} from "./FeatureAttributeName";
import {getFeatureAttributeStrategyByName} from "../../attributeStrategies/functions/getFeatureAttributeStrategyByName";
import {MapFeature} from "./MapFeature";
import {MapFeatureState} from "./MapFeatureState";

const typesVisibility: {[index: string]: boolean} = {};
Object.values(FeatureType).map(type => {
  typesVisibility[type] = true;
});

const featuresByType: {
  [featureType: string]: FeaturesByType;
} = {};

//Here we create an initial featuresByType value for each FeatureType
Object.values(FeatureType).map(featureType => {
  featuresByType[featureType] = {
    features: [],
    dirty: false,
    featureTypeState: MapFeatureTypeState.ABSENT_ON_MAP,
    attributeStates: {},
    visible: false,
  };

  //Populate the attribute state with null values for all properties.
  var filterIndexCounter = 0;
  Object.keys(FeatureAttributeName).map(attributeName => {
    const featureAttributeStrategy = getFeatureAttributeStrategyByName(
      attributeName
    );
    let attributeStatesofFeatureType =
      featuresByType[featureType].attributeStates;
    featureAttributeStrategy.buildInitialFeatureAttributeState(
      attributeStatesofFeatureType,
      filterIndexCounter
    );
    filterIndexCounter += 1;
  });
});

const features = [];
const rootFeature: MapFeature = {
  __typename: "Feature",
  regions: [],
  uri: "root-uri",
  geometry: {__typename: "ParsedGeometry", label: "", wkt: "", uri: ""},
  state: MapFeatureState.LOADED,
  type: FeatureType.Root,
};
features.push(rootFeature);
export const initialMapState: MapState = {
  keplerGlInstanceRegistered: false,
  features,
  featuresByType: featuresByType,
  typesVisibility: typesVisibility,
  filterCounter: 0,
  loadingState: {},
};
