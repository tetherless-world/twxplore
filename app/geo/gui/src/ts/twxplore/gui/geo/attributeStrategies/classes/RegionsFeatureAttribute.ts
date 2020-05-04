import {StringFeatureAttribute} from "./StringFeatureAttribute";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../states/map/KeplerFilterType";

export class RegionsFeatureAttribute extends StringFeatureAttribute {
  static readonly instance = new RegionsFeatureAttribute();
  readonly name = FeatureAttributeName.regions;
  readonly keplerFilterType = KeplerFilterType.MULTISELECT;
}
