import {FeatureAttribute} from "./FeatureAttribute";
import {KeplerFilterType} from "../../states/map/KeplerFilterType";
import {TypeOfFeatureAttribute} from "../../states/map/TypeOfFeatureAttribute";
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
  readonly typeOfAttribute = TypeOfFeatureAttribute.UNDEFINED;
  readonly keplerFilterType = KeplerFilterType.NONE;
  readonly ignore = true;
}
