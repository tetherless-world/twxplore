import {StringFeatureAttribute} from "./StringFeatureAttributeStrategy";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../states/map/KeplerFilterType";

export class RegionsFeatureAttributeStrategy extends StringFeatureAttribute {
  static readonly instance = new RegionsFeatureAttributeStrategy();
  readonly name = FeatureAttributeName.regions;
  readonly keplerFilterType = KeplerFilterType.MULTISELECT;
}
