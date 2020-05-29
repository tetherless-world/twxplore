import {KeplerFilterType} from "../../states/map/KeplerFilterType";
import {TypeOfFeatureAttribute} from "../../states/map/TypeOfFeatureAttribute";
import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {Dispatch} from "redux";
import {FeatureAttributeStrategy} from "./FeatureAttributeStrategy";
import {MapFeatureAttributeNumericRange} from "../../states/map/MapFeatureAttributeState/MapNumericFeatureAttributeState";

export class IgnoreFeatureAttributeStrategy
  implements FeatureAttributeStrategy {
  getAttributeRangeLabel(
    currentRangeOfAttributeOfFeatureType: MapFeatureAttributeNumericRange
  ): string {
    return "";
  }
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
  static readonly instance = new IgnoreFeatureAttributeStrategy();
  readonly name = "";
  readonly typeOfAttribute = TypeOfFeatureAttribute.UNDEFINED;
  readonly keplerFilterType = KeplerFilterType.NONE;
  readonly ignore = true;
}
