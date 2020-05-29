// In an OOP Language -

import {KeplerFilterType} from "../../states/map/KeplerFilterType";
import {TypeOfFeatureAttribute} from "../../states/map/TypeOfFeatureAttribute";
import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {Dispatch} from "redux";
import {MapFeature} from "../../states/map/MapFeature";
import {MapFeatureAttributeNumericRange} from "../../states/map/MapFeatureAttributeState/MapNumericFeatureAttributeState";

// TypeScript

export interface FeatureAttributeStrategy {
  readonly name: string;
  readonly typeOfAttribute: TypeOfFeatureAttribute;
  readonly keplerFilterType: KeplerFilterType;
  readonly ignore: boolean;
  setInitialFilters(
    filterIndexOfAttribute: number,
    stateOfAttribute: MapFeatureAttributeState,
    dispatch: Dispatch<any>
  ): void;
  updateAttributeStatesOfFeatureType(
    attributeStatesOfFeatureType: {
      [featureAttributeName: string]: MapFeatureAttributeState;
    },
    addedFeature: MapFeature
  ): void;
  buildInitialFeatureAttributeState(
    attributeStatesOfFeatureType: {
      [featureAttributeName: string]: MapFeatureAttributeState;
    },
    filterIndexCounter: number
  ): void;

  getAttributeRangeLabel(
    currentRangeOfAttributeOfFeatureType: MapFeatureAttributeNumericRange
  ): string;
}
