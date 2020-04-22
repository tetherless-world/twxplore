import {FeatureAttribute} from "./FeatureAttribute";
import {FeatureAttributeName} from "../states/map/FeatureAttributeName";
import {FilterType} from "../states/map/FilterType";
import {TypeOfFeatureAttribute} from "../states/map/TypeOfFeatureAttribute";

export class FrequencyFeatureAttribute implements FeatureAttribute {
  static readonly instance = new FrequencyFeatureAttribute();

  readonly name = FeatureAttributeName.transmissionPower;
  readonly typeOf = TypeOfFeatureAttribute.NUMBER;
  readonly filterType = FilterType.RANGE;
  readonly ignore = false;
}
