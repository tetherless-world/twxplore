import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../states/map/KeplerFilterType";
import {NumericFeatureAttribute} from "./NumericFeatureAttribute";

export class FrequencyFeatureAttributeStrategy extends NumericFeatureAttribute {
  static readonly instance = new FrequencyFeatureAttributeStrategy();
  readonly name = FeatureAttributeName.frequency;
  readonly keplerFilterType = KeplerFilterType.RANGE;
}
