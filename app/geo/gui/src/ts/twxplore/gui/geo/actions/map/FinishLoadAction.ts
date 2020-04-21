import {Action} from "redux-actions";

export type FINISH_LOAD_ACTION = "FINISH_LOAD_ACTION";
export const FINISH_LOAD_ACTION: FINISH_LOAD_ACTION = "FINISH_LOAD_ACTION";

export interface FinishLoadAction extends Action<{uris: string[]}> {
  type: FINISH_LOAD_ACTION;
}

export const finishLoad = (featureUris: string[]): FinishLoadAction => ({
  payload: {uris: featureUris},
  type: FINISH_LOAD_ACTION,
});
