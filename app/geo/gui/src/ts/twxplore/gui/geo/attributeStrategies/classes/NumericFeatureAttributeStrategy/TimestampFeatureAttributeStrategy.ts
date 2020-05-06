import {FeatureAttributeName} from "../../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../../states/map/KeplerFilterType";
import {NumericFeatureAttributeStrategy} from "./NumericFeatureAttributeStrategy";

export class TimestampFeatureAttributeStrategy extends NumericFeatureAttributeStrategy {
  static readonly instance = new TimestampFeatureAttributeStrategy();
  readonly name = FeatureAttributeName.timestamp;
  readonly keplerFilterType = KeplerFilterType.TIMERANGE;
}
