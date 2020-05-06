import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../states/map/KeplerFilterType";
import {StringFeatureAttribute} from "./StringFeatureAttributeStrategy";

export class LabelFeatureAttributeStrategy extends StringFeatureAttribute {
  static readonly instance = new LabelFeatureAttributeStrategy();
  readonly name = FeatureAttributeName.label;
  readonly keplerFilterType = KeplerFilterType.MULTISELECT;
}
