// In an OOP Language -

import {KeplerFilterType} from "../../states/map/KeplerFilterType";
import {TypeOfFeatureAttribute} from "../../states/map/TypeOfFeatureAttribute";
import {KeplerFieldType} from "../../states/map/KeplerFieldType";
import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {Dispatch} from "redux";
import {MapFeature} from "../../states/map/MapFeature";

// TypeScript

export interface FeatureAttribute {
  readonly name: string;
  readonly typeOf: TypeOfFeatureAttribute;
  readonly KeplerFilterType: KeplerFilterType;
  readonly KeplerFieldType: KeplerFieldType;
  readonly ignore: boolean;
  setInitialFilters(
    filterIndexOfAttribute: number,
    stateOfAttribute: MapFeatureAttributeState,
    dispatch: Dispatch<any>
  ): void;
  buildInitialFeatureAttributeState(attributeStatesOfFeatureType: {
    [featureAttributeName: string]: MapFeatureAttributeState;
  }): void;
  updateAttributeStatesOfFeatureType(
    attributeStatesOfFeatureType: {
      [featureAttributeName: string]: MapFeatureAttributeState;
    },
    addedFeature: MapFeature
  ): void;
}
