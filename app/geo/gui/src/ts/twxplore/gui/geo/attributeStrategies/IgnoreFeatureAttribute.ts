import {FeatureAttribute} from "./FeatureAttribute";
import {FilterType} from "../states/map/FilterType";
import {TypeOfFeatureAttribute} from "../states/map/TypeOfFeatureAttribute";

export class IgnoreFeatureAttribute implements FeatureAttribute {
  static readonly instance = new IgnoreFeatureAttribute();

  readonly name = "";
  readonly typeOf = TypeOfFeatureAttribute.UNDEFINED;
  readonly filterType = FilterType.NONE;
  readonly ignore = true;
}
