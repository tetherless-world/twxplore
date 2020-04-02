import {FilterType} from "../states/map/FilterType";
import {FeatureAttributeName} from "../states/map/FeatureAttributeName";
import {FeatureAttribute} from "./FeatureAttribute";

export class TransmissionPowerFeatureAttribute implements FeatureAttribute {
  static readonly instance = new TransmissionPowerFeatureAttribute();

  readonly isNumeric = true;
  readonly name = FeatureAttributeName.transmissionPower;
  readonly isString = false;
  readonly filterType = FilterType.RANGE;
  readonly ignore = true;
}
