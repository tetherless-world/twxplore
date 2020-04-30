import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../states/map/KeplerFilterType";
import {KeplerFieldType} from "../../states/map/KeplerFieldType";
import {NumericFeatureAttribute} from "./NumericFeatureAttribute";

export class TransmissionPowerFeatureAttribute extends NumericFeatureAttribute {
  static readonly instance = new TransmissionPowerFeatureAttribute();
  readonly name = FeatureAttributeName.transmissionPower;
  readonly KeplerFilterType = KeplerFilterType.RANGE;
  readonly KeplerFieldType = KeplerFieldType.INTEGER;
}
