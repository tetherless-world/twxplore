import {FeatureAttributeName} from "../../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../../states/map/KeplerFilterType";
import {NumericFeatureAttributeStrategy} from "./NumericFeatureAttributeStrategy";
import {MapFeatureAttributeNumericRange} from "../../../states/map/MapFeatureAttributeState/MapNumericFeatureAttributeState";
import { frequencyToString } from "../../../attributeConversionFunctions/frequencyToString";

export class FrequencyFeatureAttributeStrategy extends NumericFeatureAttributeStrategy {
  getAttributeRangeLabel(
    currentRangeOfAttributeOfFeatureType: MapFeatureAttributeNumericRange
  ): string {
    const minFrequencyString = frequencyToString(currentRangeOfAttributeOfFeatureType.min)
    const maxFrequencyString = frequencyToString(currentRangeOfAttributeOfFeatureType.max)
    return (
      "Frequency range: " + minFrequencyString + " - " + maxFrequencyString
    );
  }
  static readonly instance = new FrequencyFeatureAttributeStrategy();
  readonly name = FeatureAttributeName.frequency;
  readonly keplerFilterType = KeplerFilterType.RANGE;
}
