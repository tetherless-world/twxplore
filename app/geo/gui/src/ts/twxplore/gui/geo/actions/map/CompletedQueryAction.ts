import {Action} from "redux-actions";

export type COMPLETED_QUERY = "COMPLETED_QUERY";
export const COMPLETED_QUERY: COMPLETED_QUERY = "COMPLETED_QUERY";

export interface CompletedQueryAction
  extends Action<{uri: string; latestQueryLength: number}> {
  type: COMPLETED_QUERY;
}

export const completedQuery = (
  uri: string,
  latestQueryLength: number
): CompletedQueryAction => ({
  payload: {uri: uri, latestQueryLength: latestQueryLength},
  type: COMPLETED_QUERY,
});
