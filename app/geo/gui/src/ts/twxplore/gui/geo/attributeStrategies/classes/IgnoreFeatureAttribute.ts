import {FeatureAttribute} from "./FeatureAttribute";
import {FilterType} from "../../states/map/FilterType";
import {TypeOfFeatureAttribute} from "../../states/map/TypeOfFeatureAttribute";
import {FieldType} from "../../states/map/FieldType";

export class IgnoreFeatureAttribute implements FeatureAttribute {
  static readonly instance = new IgnoreFeatureAttribute();

  setInitialFilters(
    filterIndexOfAttribute: number,
    stateOfAttribute: MapFeatureAttributeState
  ): void {}
  readonly name = "";
  readonly typeOf = TypeOfFeatureAttribute.UNDEFINED;
  readonly filterType = FilterType.NONE;
  readonly fieldType = FieldType.NONE;
  readonly ignore = true;
}
