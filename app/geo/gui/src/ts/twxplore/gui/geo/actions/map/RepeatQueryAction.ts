import {Action} from "redux-actions";

export type REPEAT_QUERY = "REPEAT_QUERY";
export const REPEAT_QUERY: REPEAT_QUERY = "REPEAT_QUERY";

export interface RepeatQueryAction extends Action<{featureUri: string}> {
  type: REPEAT_QUERY;
}

export const repeatQuery = (featureUri: string): RepeatQueryAction => ({
  payload: {featureUri: featureUri},
  type: REPEAT_QUERY,
});
