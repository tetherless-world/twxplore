import {FeatureAttributeName} from "../../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../../states/map/KeplerFilterType";
import {NumericFeatureAttributeStrategy} from "./NumericFeatureAttributeStrategy";
import {MapFeatureAttributeNumericRange} from "../../../states/map/MapFeatureAttributeState/MapNumericFeatureAttributeState";

export class FrequencyFeatureAttributeStrategy extends NumericFeatureAttributeStrategy {
  getAttributeRangeLabel(
    currentRangeOfAttributeOfFeatureType: MapFeatureAttributeNumericRange
  ): string {
    const minFrequencyString =
      (
        Math.floor((currentRangeOfAttributeOfFeatureType.min / 1000000) * 100) /
        100
      ).toString() +
      " " +
      "MHz";

    const maxFrequencyString =
      (
        Math.floor((currentRangeOfAttributeOfFeatureType.max / 1000000) * 100) /
        100
      ).toString() +
      " " +
      "MHz";

    return (
      "frequency Range: " + minFrequencyString + " - " + maxFrequencyString
    );
  }
  static readonly instance = new FrequencyFeatureAttributeStrategy();
  readonly name = FeatureAttributeName.frequency;
  readonly keplerFilterType = KeplerFilterType.RANGE;
}
