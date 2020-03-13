import {Action} from "redux-actions";

export type CHANGE_TYPE_VISIBILITY = "CHANGE_TYPE_VISIBILITY";
export const CHANGE_TYPE_VISIBILITY: CHANGE_TYPE_VISIBILITY =
  "CHANGE_TYPE_VISIBILITY";
export interface ChangeTypeVisibilityAction extends Action<{typeName: string}> {
  type: CHANGE_TYPE_VISIBILITY;
}

export const changeTypeVisibility = (
  typeName: string
): ChangeTypeVisibilityAction => ({
  payload: {typeName: typeName},
  type: CHANGE_TYPE_VISIBILITY,
});
