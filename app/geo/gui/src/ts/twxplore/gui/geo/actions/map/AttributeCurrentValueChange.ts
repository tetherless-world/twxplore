import {Action} from "redux-actions";

export type ATTRIBUTE_CURRENT_VALUE_CHANGE = "ATTRIBUTE_CURRENT_VALUE_CHANGE";

export const ATTRIBUTE_CURRENT_VALUE_CHANGE: ATTRIBUTE_CURRENT_VALUE_CHANGE =
  "ATTRIBUTE_CURRENT_VALUE_CHANGE";

export interface AttributeCurrentValueChangeAction
  extends Action<{
    featureType: string;
    attributeName: string;
    newValue: number[] | number;
  }> {
  type: ATTRIBUTE_CURRENT_VALUE_CHANGE;
}

export const attributeCurrentValueChange = (
  featureType: string,
  attributeName: string,
  newValue: number[] | number
): AttributeCurrentValueChangeAction => ({
  payload: {featureType, attributeName, newValue},
  type: ATTRIBUTE_CURRENT_VALUE_CHANGE,
});
