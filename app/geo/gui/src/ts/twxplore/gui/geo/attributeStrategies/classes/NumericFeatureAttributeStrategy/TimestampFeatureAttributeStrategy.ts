import {FeatureAttributeName} from "../../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../../states/map/KeplerFilterType";
import {NumericFeatureAttributeStrategy} from "./NumericFeatureAttributeStrategy";
import {MapFeatureAttributeNumericRange} from "../../../states/map/MapFeatureAttributeState/MapNumericFeatureAttributeState";

export class TimestampFeatureAttributeStrategy extends NumericFeatureAttributeStrategy {
  getAttributeRangeLabel(
    currentRangeOfAttributeOfFeatureType: MapFeatureAttributeNumericRange
  ): string {
    const minDateString = new Date(
      currentRangeOfAttributeOfFeatureType.min
    ).toLocaleDateString("en-US");
    const maxDateString = new Date(
      currentRangeOfAttributeOfFeatureType.max
    ).toLocaleDateString("en-US");

    return "timestamp Range: " + minDateString + " - " + maxDateString;
  }
  static readonly instance = new TimestampFeatureAttributeStrategy();
  readonly name = FeatureAttributeName.timestamp;
  readonly keplerFilterType = KeplerFilterType.TIMERANGE;
}
