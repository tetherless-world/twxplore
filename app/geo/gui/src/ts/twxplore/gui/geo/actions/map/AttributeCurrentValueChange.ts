import {Action} from "redux-actions";

export type FILTER_CURRENT_VALUE_CHANGE = "ATTRIBUTE_CURRENT_VALUE_CHANGE";

export const FILTER_CURRENT_VALUE_CHANGE: FILTER_CURRENT_VALUE_CHANGE =
  "ATTRIBUTE_CURRENT_VALUE_CHANGE";

export interface FilterCurrentValueChangeAction
  extends Action<{
    featureType: string;
    attributeName: string;
    newValue: number[] | number;
  }> {
  type: FILTER_CURRENT_VALUE_CHANGE;
}

export const filterCurrentValueChange = (
  featureType: string,
  attributeName: string,
  newValue: number[] | number
): FilterCurrentValueChangeAction => ({
  payload: {featureType, attributeName, newValue},
  type: FILTER_CURRENT_VALUE_CHANGE,
});
