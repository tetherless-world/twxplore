import {NumericFeatureAttribute} from "./NumericFeatureAttribute";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../states/map/KeplerFilterType";
import {KeplerFieldType} from "../../states/map/KeplerFieldType";

export class TimestampFeatureAttribute extends NumericFeatureAttribute {
  static readonly instance = new TimestampFeatureAttribute();
  readonly name = FeatureAttributeName.timestamp;
  readonly KeplerFilterType = KeplerFilterType.TIMERANGE;
  readonly KeplerFieldType = KeplerFieldType.TIMESTAMP;
}
