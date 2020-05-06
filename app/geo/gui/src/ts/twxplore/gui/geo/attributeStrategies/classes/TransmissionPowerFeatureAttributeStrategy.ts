import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../states/map/KeplerFilterType";
import {NumericFeatureAttribute} from "./NumericFeatureAttribute";

export class TransmissionPowerFeatureAttributeStrategy extends NumericFeatureAttribute {
  static readonly instance = new TransmissionPowerFeatureAttributeStrategy();
  readonly name = FeatureAttributeName.transmissionPower;
  readonly keplerFilterType = KeplerFilterType.RANGE;
}
