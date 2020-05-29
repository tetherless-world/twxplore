import {FeatureAttributeName} from "../../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../../states/map/KeplerFilterType";
import {NumericFeatureAttributeStrategy} from "./NumericFeatureAttributeStrategy";
import {MapFeatureAttributeNumericRange} from "../../../states/map/MapFeatureAttributeState/MapNumericFeatureAttributeState";

export class FrequencyFeatureAttributeStrategy extends NumericFeatureAttributeStrategy {
  getAttributeChipLabel(
    currentRangeOfAttributeOfFeatureType: MapFeatureAttributeNumericRange
  ): string {
    return "";
  }
  static readonly instance = new FrequencyFeatureAttributeStrategy();
  readonly name = FeatureAttributeName.frequency;
  readonly keplerFilterType = KeplerFilterType.RANGE;
}
