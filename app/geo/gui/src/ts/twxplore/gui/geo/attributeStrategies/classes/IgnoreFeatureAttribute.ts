import {FeatureAttribute} from "./FeatureAttribute";
import {FilterType} from "../../states/map/FilterType";
import {TypeOfFeatureAttribute} from "../../states/map/TypeOfFeatureAttribute";
import {FieldType} from "../../states/map/FieldType";
import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {Dispatch} from "redux";

export class IgnoreFeatureAttribute implements FeatureAttribute {
  updateAttributeStatesOfFeatureType(
    attributeStatesOfFeatureType: {
      [featureAttributeName: string]: MapFeatureAttributeState;
    },
    addedFeature: import("../../states/map/MapFeature").MapFeature
  ): void {}
  buildInitialFeatureAttributeState(attributeStatesOfFeatureType: {
    [featureAttributeName: string]: MapFeatureAttributeState;
  }): void {}

  setInitialFilters(
    filterIndexOfAttribute: number,
    stateOfAttribute: MapFeatureAttributeState,
    dispatch: Dispatch<any>
  ): void {}
  static readonly instance = new IgnoreFeatureAttribute();
  readonly name = "";
  readonly typeOf = TypeOfFeatureAttribute.UNDEFINED;
  readonly filterType = FilterType.NONE;
  readonly fieldType = FieldType.NONE;
  readonly ignore = true;
}
