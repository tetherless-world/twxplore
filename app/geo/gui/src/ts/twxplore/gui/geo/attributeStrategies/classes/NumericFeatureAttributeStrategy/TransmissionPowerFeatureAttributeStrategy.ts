import {FeatureAttributeName} from "../../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../../states/map/KeplerFilterType";
import {NumericFeatureAttributeStrategy} from "./NumericFeatureAttributeStrategy";
import {MapFeatureAttributeNumericRange} from "../../../states/map/MapFeatureAttributeState/MapNumericFeatureAttributeState";

export class TransmissionPowerFeatureAttributeStrategy extends NumericFeatureAttributeStrategy {
  getAttributeChipLabel(
    currentRangeOfAttributeOfFeatureType: MapFeatureAttributeNumericRange
  ): string {
    return (
      "transmissionPower Range: " +
      currentRangeOfAttributeOfFeatureType.min +
      "dB" +
      " - " +
      currentRangeOfAttributeOfFeatureType.max +
      "dB"
    );
  }

  static readonly instance = new TransmissionPowerFeatureAttributeStrategy();
  readonly name = FeatureAttributeName.transmissionPower;
  readonly keplerFilterType = KeplerFilterType.RANGE;
}
