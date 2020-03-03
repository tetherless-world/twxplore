import {TreeMapQuery_TreesBySelection} from 'twxplore/gui/geo/api/queries/types/TreeMapQuery'
import {Action} from 'redux-actions';

export type APPEND_MAP = 'APPEND_MAP';
export const APPEND_MAP: APPEND_MAP = 'APPEND_MAP';
export type SELECT_DATA = 'SELECT_DATA'
export const SELECT_DATA: SELECT_DATA = 'SELECT_DATA';

export interface SelectDataAction extends Action<TreeMapQuery_TreesBySelection> {
    type: SELECT_DATA
}

export interface AppendMapAction extends Action<{ map: string, uri: string }> {
    type: APPEND_MAP
}

export type Action_Types = SelectDataAction | AppendMapAction

export function sendSelectionData(data: TreeMapQuery_TreesBySelection): Action_Types {
    return {
        type: SELECT_DATA,
        payload : data
    }
}

export function sendAppendMap(a_map: string, a_uri: string): Action_Types{
    return {
        type: APPEND_MAP,
        payload: {
            map: a_map,
            uri: a_uri

        }
    }
}
