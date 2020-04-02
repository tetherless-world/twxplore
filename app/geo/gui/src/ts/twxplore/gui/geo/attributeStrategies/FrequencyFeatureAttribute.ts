import {FeatureAttribute} from "./FeatureAttribute";
import {FeatureAttributeName} from "../states/map/FeatureAttributeName";
import {FilterName} from "../states/map/FilterName";

export class FrequencyFeatureAttribute extends FeatureAttribute {
  static readonly instance: FrequencyFeatureAttribute = new FrequencyFeatureAttribute();

  readonly isNumeric = true;
  readonly name = FeatureAttributeName.transmissionPower;
  readonly isString = false;
  readonly filterType = FilterName.RANGE;
  readonly ignore = false;
}
