import {FeatureAttribute} from "./FeatureAttribute";
import {FilterType} from "../states/map/FilterName";

export class IgnoreFeatureAttribute implements FeatureAttribute {
  static readonly instance = new IgnoreFeatureAttribute();

  readonly isNumeric = false;
  readonly name = "";
  readonly isString = false;
  readonly filterType = FilterType.NONE;
  readonly ignore = true;
}
