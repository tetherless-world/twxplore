import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../states/map/KeplerFilterType";
import {StringFeatureAttribute} from "./StringFeatureAttribute";

export class LabelFeatureAttribute extends StringFeatureAttribute {
  static readonly instance = new LabelFeatureAttribute();
  readonly name = FeatureAttributeName.label;
  readonly keplerFilterType = KeplerFilterType.MULTISELECT;
}
