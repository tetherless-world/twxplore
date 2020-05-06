import {FeatureAttributeName} from "../../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../../states/map/KeplerFilterType";
import {NumericFeatureAttributeStrategy} from "./NumericFeatureAttributeStrategy";

export class TransmissionPowerFeatureAttributeStrategy extends NumericFeatureAttributeStrategy {
  static readonly instance = new TransmissionPowerFeatureAttributeStrategy();
  readonly name = FeatureAttributeName.transmissionPower;
  readonly keplerFilterType = KeplerFilterType.RANGE;
}
