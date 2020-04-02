import {FeatureAttributeName} from "../states/map/FeatureAttributeName";
import {FilterName} from "../states/map/FilterName";
import {FeatureAttribute} from "./FeatureAttribute";

export class TimestampFeatureAttribute extends FeatureAttribute {
  static readonly instance: TimestampFeatureAttribute = new TimestampFeatureAttribute();

  readonly name = FeatureAttributeName.timestamp;
  readonly isNumeric = true;
  readonly isString = false;
  readonly filterType = FilterName.TIMERANGE;
  readonly ignore = false;
}
