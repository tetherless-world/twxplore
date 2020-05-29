import {FeatureAttributeName} from "../../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../../states/map/KeplerFilterType";
import {NumericFeatureAttributeStrategy} from "./NumericFeatureAttributeStrategy";
import {MapFeatureAttributeNumericRange} from "../../../states/map/MapFeatureAttributeState/MapNumericFeatureAttributeState";
import { transmissionPowerToString } from "../../../attributeConversionFunctions/transmissionPowerToString";

export class TransmissionPowerFeatureAttributeStrategy extends NumericFeatureAttributeStrategy {
  getAttributeRangeLabel(
    currentRangeOfAttributeOfFeatureType: MapFeatureAttributeNumericRange
  ): string {
    return (
      "Transmission power range: " +
     transmissionPowerToString(currentRangeOfAttributeOfFeatureType.min) +
      " - " +
      transmissionPowerToString(currentRangeOfAttributeOfFeatureType.max)
    );
  }

  static readonly instance = new TransmissionPowerFeatureAttributeStrategy();
  readonly name = FeatureAttributeName.transmissionPower;
  readonly keplerFilterType = KeplerFilterType.RANGE;
}
