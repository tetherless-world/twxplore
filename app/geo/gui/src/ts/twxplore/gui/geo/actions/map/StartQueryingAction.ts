import {Action} from "redux-actions";

export type START_QUERYING = "START_QUERYING";
export const START_QUERYING: START_QUERYING = "START_QUERYING";

export interface StartQueryingAction extends Action<{uri: string}> {
  type: START_QUERYING;
}

export const startQuerying = (uri: string): StartQueryingAction => ({
  payload: {uri: uri},
  type: START_QUERYING,
});
