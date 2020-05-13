import {Action} from "redux-actions";

export type CLICK_ROOT = "CLICK_ROOT";
export const CLICK_ROOT: CLICK_ROOT = "CLICK_ROOT";

export interface ClickRootAction extends Action<{}> {
  type: CLICK_ROOT;
}

export const clickRoot = (): ClickRootAction => ({
  type: "CLICK_ROOT",
  payload: {},
});
