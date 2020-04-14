import {Action} from "redux-actions";

export type REPEAT_QUERY = "REPEAT_QUERY";
export const REPEAT_QUERY: REPEAT_QUERY = "REPEAT_QUERY";

export interface RepeatQueryAction extends Action<{uri: string}> {
  type: REPEAT_QUERY;
}

export const repeatQuery = (uri: string): RepeatQueryAction => ({
  payload: {uri: uri},
  type: REPEAT_QUERY,
});
