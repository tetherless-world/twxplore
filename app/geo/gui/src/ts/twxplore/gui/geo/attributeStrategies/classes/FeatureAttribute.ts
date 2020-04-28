// In an OOP Language -

import {FilterType} from "../../states/map/FilterType";
import {TypeOfFeatureAttribute} from "../../states/map/TypeOfFeatureAttribute";
import {FieldType} from "../../states/map/FieldType";
import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {Dispatch} from "redux";

// TypeScript

export interface FeatureAttribute {
  readonly name: string;
  readonly typeOf: TypeOfFeatureAttribute;
  readonly filterType: FilterType;
  readonly fieldType: FieldType;
  readonly ignore: boolean;
  setInitialFilters(
    filterIndexOfAttribute: number,
    stateOfAttribute: MapFeatureAttributeState,
    dispatch: Dispatch<any>
  ): void;
  buildInitialFeatureAttributeState(attributeStatesOfFeatureType: {
    [featureAttributeName: string]: MapFeatureAttributeState;
  }): void;
}
