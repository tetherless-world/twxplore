import {FilterType} from "../states/map/FilterType";
import {FeatureAttributeName} from "../states/map/FeatureAttributeName";
import {FeatureAttribute} from "./FeatureAttribute";
import {TypeOfFeatureAttribute} from "../states/map/TypeOfFeatureAttribute";

export class TransmissionPowerFeatureAttribute implements FeatureAttribute {
  static readonly instance = new TransmissionPowerFeatureAttribute();

  readonly isNumeric = true;
  readonly name = FeatureAttributeName.transmissionPower;
  readonly isString = false;
  readonly filterType = FilterType.RANGE;
  readonly ignore = false;
  readonly typeOf = TypeOfFeatureAttribute.NUMBER;
}
