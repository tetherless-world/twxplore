import {FeatureAttributeName} from "../states/map/FeatureAttributeName";
import {FilterType} from "../states/map/FilterType";
import {FeatureAttribute} from "./FeatureAttribute";
import {TypeOfFeatureAttribute} from "../states/map/TypeOfFeatureAttribute";

export class TimestampFeatureAttribute implements FeatureAttribute {
  static readonly instance = new TimestampFeatureAttribute();

  readonly name = FeatureAttributeName.timestamp;
  readonly isNumeric = true;
  readonly isString = false;
  readonly filterType = FilterType.TIMERANGE;
  readonly ignore = false;
  readonly typeOf = TypeOfFeatureAttribute.NUMBER;
}
