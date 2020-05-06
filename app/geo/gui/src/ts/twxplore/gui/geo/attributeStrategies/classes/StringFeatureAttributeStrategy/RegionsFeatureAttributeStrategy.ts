import {FeatureAttributeName} from "../../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../../states/map/KeplerFilterType";
import {StringFeatureAttributeStrategy} from "./StringFeatureAttributeStrategy";

export class RegionsFeatureAttributeStrategy extends StringFeatureAttributeStrategy {
  static readonly instance = new RegionsFeatureAttributeStrategy();
  readonly name = FeatureAttributeName.regions;
  readonly keplerFilterType = KeplerFilterType.MULTISELECT;
}
