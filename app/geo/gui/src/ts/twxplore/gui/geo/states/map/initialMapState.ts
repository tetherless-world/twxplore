import {MapState} from "./MapState";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {FeaturesByType} from "./FeaturesByType";
import {MapFeatureTypeState} from "./MapFeatureTypeState";
import {FeatureAttributeName} from "./FeatureAttributeName";
import {getFeatureAttributeByName} from "../../attributeStrategies/getFeatureAttributeByName";

const typesVisibility: {[index: string]: boolean} = {};
Object.values(FeatureType).map(type => {
  typesVisibility[type] = true;
});

const featuresByType: {
  [featureType: string]: FeaturesByType;
} = {};
Object.values(FeatureType).map(type => {
  featuresByType[type] = {
    features: [],
    dirty: false,
    featureTypeState: MapFeatureTypeState.ABSENT_ON_MAP,
    attributeStates: {},
  };
});

//Here we create an initial featuresByType value for each FeatureType
Object.values(FeatureType).map(type => {
  featuresByType[type] = {
    features: [],
    dirty: false,
    featureTypeState: MapFeatureTypeState.ABSENT_ON_MAP,
    attributeStates: {},
  };
  //Populate the attribute state with null values for all properties.
  Object.keys(FeatureAttributeName).map(attributeName => {
    const FeatureAttribute = getFeatureAttributeByName(attributeName);
    if (FeatureAttribute.isNumeric) {
      featuresByType[type].attributeStates[attributeName] = {
        min: null,
        max: null,
        filterIndex: null,
      };
    }
  });
});

//const featureTypesFilters: {[featureType: string]: MapFilterState} = {};

export const initialMapState: MapState = {
  keplerGlInstanceRegistered: false,
  features: [],
  featuresByType: featuresByType,
  typesVisibility: typesVisibility,
  filterCounter: 0,
  filterableAttributesCounter: 0,
  loadingState: {},
};
