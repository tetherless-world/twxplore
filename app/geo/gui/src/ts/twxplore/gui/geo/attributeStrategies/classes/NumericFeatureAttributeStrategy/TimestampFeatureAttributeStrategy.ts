import {FeatureAttributeName} from "../../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../../states/map/KeplerFilterType";
import {NumericFeatureAttributeStrategy} from "./NumericFeatureAttributeStrategy";
import {MapFeatureAttributeNumericRange} from "../../../states/map/MapFeatureAttributeState/MapNumericFeatureAttributeState";

export class TimestampFeatureAttributeStrategy extends NumericFeatureAttributeStrategy {
  getAttributeChipLabel(
    currentRangeOfAttributeOfFeatureType: MapFeatureAttributeNumericRange
  ): string {
    return "";
  }
  static readonly instance = new TimestampFeatureAttributeStrategy();
  readonly name = FeatureAttributeName.timestamp;
  readonly keplerFilterType = KeplerFilterType.TIMERANGE;
}
