import {NumericFeatureAttribute} from "./NumericFeatureAttribute";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../states/map/KeplerFilterType";

export class TimestampFeatureAttributeStrategy extends NumericFeatureAttribute {
  static readonly instance = new TimestampFeatureAttributeStrategy();
  readonly name = FeatureAttributeName.timestamp;
  readonly keplerFilterType = KeplerFilterType.TIMERANGE;
}
