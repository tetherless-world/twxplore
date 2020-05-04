import {StringFeatureAttribute} from "./StringFeatureAttribute";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../states/map/KeplerFilterType";

export class LocalityFeatureAttribute extends StringFeatureAttribute {
  static readonly instance = new LocalityFeatureAttribute();
  readonly name = FeatureAttributeName.locality;
  readonly keplerFilterType = KeplerFilterType.MULTISELECT;
}
