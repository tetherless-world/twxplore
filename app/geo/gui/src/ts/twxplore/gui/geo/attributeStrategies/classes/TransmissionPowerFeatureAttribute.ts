import {FilterType} from "../states/map/FilterType";
import {FeatureAttributeName} from "../states/map/FeatureAttributeName";
import {FeatureAttribute} from "./FeatureAttribute";
import {TypeOfFeatureAttribute} from "../states/map/TypeOfFeatureAttribute";
import {FieldType} from "../states/map/FieldType";

export class TransmissionPowerFeatureAttribute implements FeatureAttribute {
  static readonly instance = new TransmissionPowerFeatureAttribute();

  readonly name = FeatureAttributeName.transmissionPower;
  readonly filterType = FilterType.RANGE;
  readonly fieldType = FieldType.INTEGER;
  readonly ignore = false;
  readonly typeOf = TypeOfFeatureAttribute.NUMBER;
}
