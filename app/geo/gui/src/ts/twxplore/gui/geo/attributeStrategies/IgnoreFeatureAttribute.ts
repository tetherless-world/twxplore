import {FeatureAttribute} from "./FeatureAttribute";
import {FilterName} from "../states/map/FilterName";

export class IgnoreFeatureAttribute extends FeatureAttribute {
  public static readonly instance: IgnoreFeatureAttribute = new IgnoreFeatureAttribute();

  readonly isNumeric = false;
  readonly name = "";
  readonly isString = false;
  readonly filterType = FilterName.NONE;
  readonly ignore = true;
}
