import {FeatureAttributeName} from "../../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../../states/map/KeplerFilterType";
import {StringFeatureAttributeStrategy} from "./StringFeatureAttributeStrategy";

export class LocalityFeatureAttributeStrategy extends StringFeatureAttributeStrategy {
  static readonly instance = new LocalityFeatureAttributeStrategy();
  readonly name = FeatureAttributeName.locality;
  readonly keplerFilterType = KeplerFilterType.MULTISELECT;
}
