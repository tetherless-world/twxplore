import {FeatureAttributeName} from "../../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../../states/map/KeplerFilterType";
import {NumericFeatureAttributeStrategy} from "./NumericFeatureAttributeStrategy";

export class FrequencyFeatureAttributeStrategy extends NumericFeatureAttributeStrategy {
  static readonly instance = new FrequencyFeatureAttributeStrategy();
  readonly name = FeatureAttributeName.frequency;
  readonly keplerFilterType = KeplerFilterType.RANGE;
}
