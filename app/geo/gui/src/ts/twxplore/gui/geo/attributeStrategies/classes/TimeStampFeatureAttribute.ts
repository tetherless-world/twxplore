import {NumericFeatureAttribute} from "./NumericFeatureAttribute";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../states/map/KeplerFilterType";

export class TimestampFeatureAttribute extends NumericFeatureAttribute {
  static readonly instance = new TimestampFeatureAttribute();
  readonly name = FeatureAttributeName.timestamp;
  readonly keplerFilterType = KeplerFilterType.TIMERANGE;
}
