import {Action} from "redux-actions";

export type APPEND_MAP = 'APPEND_MAP';
export const APPEND_MAP: APPEND_MAP = 'APPEND_MAP';

export interface AppendMapAction extends Action<{ map: string, uri: string }> {
    type: APPEND_MAP
}

export function appendMap(a_map: string, a_uri: string): AppendMapAction {
    return {
        type: APPEND_MAP,
        payload: {
            map: a_map,
            uri: a_uri

        }
    }
}
