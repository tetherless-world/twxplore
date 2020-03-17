import {Action} from "redux-actions";
import {MapFilterVariables} from "../../states/map/MapFilterVariables";

export type REPLACE_TYPE_RANGES = "REPLACE_TYPE_RANGES";
export const REPLACE_TYPE_RANGES: REPLACE_TYPE_RANGES = "REPLACE_TYPE_RANGES";
export interface ReplaceTypeRangesAction
  extends Action<{typeRanges: {[index: string]: MapFilterVariables}}> {
  type: REPLACE_TYPE_RANGES;
}

export const replaceTypeRanges = (typeRanges: {
  [index: string]: MapFilterVariables;
}): ReplaceTypeRangesAction => ({
  payload: {typeRanges: typeRanges},
  type: REPLACE_TYPE_RANGES,
});
