import {FeatureAttribute} from "./FeatureAttribute";
import {FeatureAttributeName} from "../states/map/FeatureAttributeName";
import {FilterType} from "../states/map/FilterType";

export class FrequencyFeatureAttribute implements FeatureAttribute {
  static readonly instance = new FrequencyFeatureAttribute();

  readonly isNumeric = true;
  readonly name = FeatureAttributeName.transmissionPower;
  readonly isString = false;
  readonly filterType = FilterType.RANGE;
  readonly ignore = false;
}
