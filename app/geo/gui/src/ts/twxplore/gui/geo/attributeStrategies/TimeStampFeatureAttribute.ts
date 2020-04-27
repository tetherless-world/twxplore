import {FeatureAttributeName} from "../states/map/FeatureAttributeName";
import {FilterType} from "../states/map/FilterType";
import {FeatureAttribute} from "./FeatureAttribute";
import {TypeOfFeatureAttribute} from "../states/map/TypeOfFeatureAttribute";
import {FieldType} from "../states/map/FieldType";

export class TimestampFeatureAttribute implements FeatureAttribute {
  static readonly instance = new TimestampFeatureAttribute();

  readonly name = FeatureAttributeName.timestamp;
  readonly filterType = FilterType.TIMERANGE;
  readonly fieldType = FieldType.TIMESTAMP;
  readonly ignore = false;
  readonly typeOf = TypeOfFeatureAttribute.NUMBER;
}
