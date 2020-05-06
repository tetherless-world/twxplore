import {StringFeatureAttribute} from "./StringFeatureAttributeStrategy";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../states/map/KeplerFilterType";

export class LocalityFeatureAttributeStrategy extends StringFeatureAttribute {
  static readonly instance = new LocalityFeatureAttributeStrategy();
  readonly name = FeatureAttributeName.locality;
  readonly keplerFilterType = KeplerFilterType.MULTISELECT;
}
