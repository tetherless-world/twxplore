import {Action} from "redux-actions";
import {MapFilterState} from "../../states/map/MapFilterState";

export type REPLACE_TYPE_RANGES = "REPLACE_TYPE_RANGES";
export const REPLACE_TYPE_RANGES: REPLACE_TYPE_RANGES = "REPLACE_TYPE_RANGES";
export interface ReplaceTypeRangesAction
  extends Action<{typeRanges: {[index: string]: MapFilterState}}> {
  type: REPLACE_TYPE_RANGES;
}

export const replaceTypeRanges = (typeRanges: {
  [index: string]: MapFilterState;
}): ReplaceTypeRangesAction => ({
  payload: {typeRanges: typeRanges},
  type: REPLACE_TYPE_RANGES,
});
